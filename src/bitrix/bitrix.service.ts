import { PlainObject } from "@app/ami/ami.service";
import { DispositionStatus, EndCrmCall,EndIncomigCall, EndOutgoingCall } from "@app/ami/types/interfaces";
import { ApiService } from "@app/api/api.service";
import { DatabaseService } from "@app/database/database.service";
import { LoggerService } from "@app/logger/logger.service";
import { LowdbService } from "@app/lowdb/lowdb.service";
import { CallProcessing, Departments, Users } from "@app/lowdb/types/interfaces";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BitrixCallStatusType, BitrixCallType, CreateIncomingLead, FinishCallInfo } from "./types/interfaces";

@Injectable()
export class BitrixService {
    private registerCallId: [];
    private bitrixUserId: string;
    private activity: boolean;

    constructor(
        private readonly log: LoggerService,
        private readonly lowdb: LowdbService,
        private readonly api : ApiService,
        private readonly configService : ConfigService,
        private readonly db: DatabaseService
      ) {}
  
  public async registerCallIdInBitrixAndShow(
    unicueid: string,
    incomingNumber: string,
    callId: string
  ): Promise<any> {
    try{
      const validnumber = this.validateNumber(incomingNumber);
      const departmentInfo = await this.lowdb.findDeprtmentByCallId(callId) as Departments;
      const resultRegisterCall = await this.api.externalCallregister(Number(departmentInfo.id),validnumber,BitrixCallType.incoming,CreateIncomingLead.YES,departmentInfo.timeZone);
      this.registerCallId[unicueid] = { registerBitrixCallID: resultRegisterCall.CALL_ID };
      await this.api.externalCallShow(resultRegisterCall.CALL_ID,departmentInfo.showUsers);
      this.log.info(`Уникальные вызовы ${JSON.stringify(this.registerCallId)}`);
      await this.sleep(this.configService.get('bitrix.custom.timeoutShowEvent'));
      return await this.api.externalCallHide(resultRegisterCall.CALL_ID,departmentInfo.showUsers);
    }catch(e){
      this.log.error(`registerCallIdInBitrixAndShow error: ${e}`);
    }
  }


  public async sendCallInfoByOutgoingCall(callInfo: EndOutgoingCall): Promise<any>{
    try {
      const { exten, trunkNumber,extensionNumber, billsec, disposition, recording} = callInfo;
      const bitrixUserId = await this.lowdb.getBitrixIdByExten(extensionNumber);
      const departmentInfo = await this.lowdb.findDeprtmentByCallId(trunkNumber) as Departments;
      const validnumber = this.validateNumber(exten);
      const callStatus = DispositionStatus[disposition];
      const resultRegisterCall = await this.api.externalCallregister(Number(bitrixUserId),validnumber,BitrixCallType.outgoing,CreateIncomingLead.YES,departmentInfo.timeZone);
      return await this.api.externalCallFinish(resultRegisterCall.CALL_ID,bitrixUserId,billsec,callStatus,BitrixCallType.outgoing,recording);
    } catch(e){
      this.log.error(`sendCallInfoByOutgoingCall error: ${e}`);
    }
  }

  public async sendCallInfoByOutgoingCRMCall(callInfo: EndCrmCall): Promise<any>{
    try{
      const { exten, bitrixCallId, billsec, disposition, recording,} = callInfo;
      const bitrixUserId = await this.lowdb.getBitrixIdByExten(exten);
      const callStatus = DispositionStatus[disposition];
      const result  = await this.api.externalCallFinish(bitrixCallId,bitrixUserId,billsec,callStatus,BitrixCallType.outgoing,recording);
      (disposition == DispositionStatus.ANSWERED)? this.api.getActivity(result.CRM_ACTIVITY_ID): null;
      return await this.api.updateActivityByAuthor(String(result.CRM_ACTIVITY_ID),bitrixUserId);
    }catch(e){
      this.log.error(`sendCallInfoByOutgoingCRMCall error: ${e}`);
    }
  }

  public async sendInfoByIncomingCall(callInfo: EndIncomigCall): Promise<void>{
    try{
      const { trunkNumber, unicueid, incomingNumber, billsec, recording, start }  = callInfo;
      const validnumber = this.validateNumber(incomingNumber);
      const departmentInfo = await this.lowdb.findDeprtmentByCallId(trunkNumber) as Departments;
      const { id, callId, infoId, startTime,  talkingDur, isAnswered } = await this.db.getCallInfo(incomingNumber);
      const isAnsweredCall = isAnswered ? BitrixCallStatusType.SuccessfulCall : BitrixCallStatusType.Rejected;
  
      if(departmentInfo.callProcessing == CallProcessing.queue){
        this.bitrixUserId = await this.getBitrixUserId(incomingNumber);
      }else{
        this.bitrixUserId = await this.getLastUserById(infoId);
      } 
  
      this.log.info(`Результат поиска последнего ответившего\не ответившего по входящему вызову ${this.bitrixUserId}`);
      this.bitrixUserId = this.checkBitrixUserId(this.bitrixUserId, departmentInfo);
      const finishCallInfo = this.formatCallInfo(unicueid, this.bitrixUserId, validnumber, BitrixCallType.incoming, start, billsec, isAnsweredCall, recording);
      const resultFinishCall = await this.sendInfoFinishCallToBitrix(finishCallInfo);
      if(this.activity == true && isAnsweredCall == BitrixCallStatusType.Rejected){
        await this.api.updateActivityReasonMissedCall(resultFinishCall.CRM_ACTIVITY_ID);
        const resultGetActivity = await this.api.getActivity(resultFinishCall.CRM_ACTIVITY_ID);
        await this.api.createActivity(resultGetActivity, resultFinishCall);
      }
      return;
    }catch(e){
      this.log.error(`sendInfoByIncomingCall error: ${e}`);
    }
  }

  private checkBitrixUserId(bitrixUserId: string | undefined, departmentInfo: Departments | Users){
    if(bitrixUserId == undefined){
      this.activity = false;
      return departmentInfo.id
    }else {
      this.activity = true;
      return bitrixUserId;
    }
  }

  private async sendInfoFinishCallToBitrix(callInfo: FinishCallInfo): Promise<any>{
    const resutltFinishCall = await this.api.externalCallFinish(
      this.registerCallId[callInfo.unicueid].registerBitrixCallID,
      callInfo.bitrixUserId,
      callInfo.billsec,
      callInfo.isAnswer,
      callInfo.callType,
      callInfo.recording,
      );

      if(this.configService.get('bitrix.custom.createTaskOnMissedCall') == "true"){
        await this.createTaskOnMissedCall(callInfo);
      }

      return resutltFinishCall;
  }

  private async createTaskOnMissedCall(callInfo: FinishCallInfo){
    if(callInfo.isAnswer == BitrixCallStatusType.Rejected){
      await this.api.createTask(callInfo.incomingNumber,callInfo.bitrixUserId)
    }
    return;
  }

  private formatCallInfo(...params: Array<any>):FinishCallInfo{
    const info : FinishCallInfo = {
      unicueid: params[0],
      bitrixUserId: params[1],
      incomingNumber: params[3],
      callType: params[4],
      startTime: params[5],
      billsec: params[6],
      isAnswer: params[7],
      recording: params[8]
    }
     return info;
  }

  private async getBitrixUserId(number: string): Promise<string | undefined> {
    const lastUserAnswer = await this.db.get3CXQueueCallInfo(number);
    return this.lowdb.getBitrixIdByExten(lastUserAnswer.toDialednum);
  }

  private async getLastUserById(id: number): Promise<string | undefined> {
    const lastUserAnswer = await this.db.getLastUserRing(id);
    return await this.lowdb.getBitrixIdByExten(lastUserAnswer.dn);
  }

  sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  validateNumber(number: string) {
    switch (number.length) {
      case 10:
        return `+7${number}`;
        break;
      case 11:
        return `+7${number.slice(1, 11)}`;
        break;
      default:
        return number;
        break;
    }
  }
}
