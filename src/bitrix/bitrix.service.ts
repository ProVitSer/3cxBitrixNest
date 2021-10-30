import { PlainObject } from "@app/ami/ami.service";
import { DispositionStatus, EndCrmCall,EndIncomigCall } from "@app/ami/types/interfaces";
import { ApiService } from "@app/api/api.service";
import { LoggerService } from "@app/logger/logger.service";
import { LowdbService } from "@app/lowdb/lowdb.service";
import { Departments } from "@app/lowdb/types/interfaces";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BitrixCallType, CreateIncomingLead } from "./types/interfaces";

@Injectable()
export class BitrixService {
    private registerCallId: [];

    constructor(
        private readonly log: LoggerService,
        private readonly lowdb: LowdbService,
        private readonly api : ApiService,
        private configService : ConfigService
      ) {}
  
  public async registerCallIdInBitrixAndShow(
    unicueid: string,
    incomingNumber: string,
    callId: string
  ) {
    
    const validnumber = this.validateNumber(incomingNumber);
    const departmentInfo = await this.lowdb.findDeprtmentByCallId(callId) as Departments;
    const resultRegisterCall = await this.api.externalCallregister(Number(departmentInfo.id),validnumber,BitrixCallType.incoming,CreateIncomingLead.YES,departmentInfo.timeZone);
    this.registerCallId[unicueid] = { registerBitrixCallID: resultRegisterCall.CALL_ID };
    await this.api.externalCallShow(resultRegisterCall.CALL_ID,departmentInfo.showUsers);
    this.log.info(`Уникальные вызовы ${JSON.stringify(this.registerCallId)}`)
    return await this.sleep(this.configService.get('bitrix.custom.timeoutShowEvent'));
  }


  public async sendCallInfoByOutgoingCall(callInfo: EndCrmCall){
    const { exten, unicueid, extensionNumber, bitrixCallId, billsec, disposition, recording, start, end } = callInfo;
    const bitrixUserId = await this.lowdb.getBitrixIdByExten(exten);
    const callStatus = DispositionStatus[disposition];
    const result  = await this.api.externalCallFinish(bitrixCallId,bitrixUserId,billsec,callStatus,BitrixCallType.outgoing,recording);
    (disposition == DispositionStatus.ANSWERED)? this.api.getActivity(result.CRM_ACTIVITY_ID): null;
    return await this.api.updateActivity(result.CRM_ACTIVITY_ID,bitrixUserId)
  }

  public async sendInfoByIncomingCall(callInfo: EndIncomigCall){
    const { trunkNumber, unicueid, incomingNumber, billsec, disposition, recording, start, end }  = callInfo;
    const validnumber = this.validateNumber(incomingNumber);
    const departmentInfo = await this.lowdb.findDeprtmentByCallId(trunkNumber) as Departments;

    
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
