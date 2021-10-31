import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { AmiService, PlainObject } from "@app/ami/ami.service";
import { LoggerService } from "@app/logger/logger.service";
import { LowdbService } from "@app/lowdb/lowdb.service";
import { OnExternalCallStart,BitrixMetod, BitirxUserGet, ActiveUser, Show, BitrixCallType, 
  ExternalCallShow, BitrixRegisterCallRequest, BitrixRegisterCallResponse, ExternalCallHide, BitrixExternalCallFinishRequest, GetActivity, BitrixCallStatusType, BitrixTasksFields } from "@app/bitrix/types/interfaces";
import axios, { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment-timezone';
import { DispositionStatus } from "@app/ami/types/interfaces";

@Injectable()
export class ApiService {
  private baseURL = this.configService.get('bitrix.url');
  private hash = this.configService.get('bitrix.hash');
  private bitrixUrl = `https://${this.baseURL}/rest/2/${this.hash}/`

  constructor(   
    private readonly logger: LoggerService,
    //@Inject('AMI') private readonly ami: AmiService,
    private readonly lowdb: LowdbService,
    private httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // async sendAmiCall(callInfo: OnExternalCallStart) {
  //   const { USER_ID, PHONE_NUMBER, CALL_ID } = callInfo;
  //   const extensionId = await this.lowdb.findById(String(USER_ID), "users");
  //   return await this.ami.sendAmiCall(CALL_ID,extensionId,PHONE_NUMBER);
  // }

  public async getUserIdDepartment(id: string) {
    const data = {
      "FILTER": {
        "UF_DEPARTMENT": id,
        "WORK_POSITION": this.configService.get('bitrix.custom.workPosition')
      }
    }

    const response  = (await this.httpService.post(`${this.bitrixUrl}${BitrixMetod.UserGet}`,data).toPromise()).data.result as BitirxUserGet[]
    return (response.length != 0) ? response[0].ID : response;
  }

  public async getActiveUsers(startPage: number = 0){
    const data = {
      "FILTER": {
        "ACTIVE": ActiveUser.active,
      }
    }
    return (await this.httpService.post(`${this.bitrixUrl}${BitrixMetod.UserGet}?start=${startPage}`,data).toPromise()).data //as BitirxUserGet[];
  }

  public async externalCallregister(bitrixTrunkId: number, number: string, callType: BitrixCallType, createLead: number, timeZone: string) : Promise<BitrixRegisterCallResponse>{
    const today = moment();
    const data: BitrixRegisterCallRequest = {
      "USER_ID": bitrixTrunkId,
      "PHONE_NUMBER": number,
      "TYPE": callType,
      "CALL_START_DATE": today.tz(timeZone).format('YYYY-MM-DD H:mm:ss'),
      "CRM_CREATE": createLead,
      "SHOW": Show.NO
    }

    this.logger.info(`Отправляем данные для рагистрации вызова ${JSON.stringify(data)}`);
    try{
       
      const { result }  = (await this.httpService.post(`${this.bitrixUrl}${BitrixMetod.ExternalCallRegister}`,data).toPromise()).data;
      this.logger.info(`Результат регистрации вызова ${result}`);
      return result;
    } catch(e){
      this.logger.error(`Ошибка регистрация вызова в Битриксе ${e}`)
    }
  }

  public async externalCallShow(callId: string,showUserArray: Array<string>): Promise<any>{

    const data: ExternalCallShow = {
      CALL_ID: callId,
      USER_ID: showUserArray || []
    }

    try{
      const { result } = (await this.httpService.post(`${this.bitrixUrl}${BitrixMetod.ExternalCallShow}`,data).toPromise()).data;
      this.logger.info(`Результат показа всплывающей карточки пользователем ${result}`)
      return;
    } catch(e){
      this.logger.error(`Ошибка показа карточки в Битриксе ${e}`)
    }
  }

  public async externalCallHide(callId: string,showUserArray: Array<string>): Promise<any>{
    const data: ExternalCallHide = {
      CALL_ID: callId,
      USER_ID: showUserArray || []
    }

    try{
      const { result } = (await this.httpService.post(`${this.bitrixUrl}${BitrixMetod.ExternalCallHide}`,data).toPromise()).data;
      this.logger.info(`Результат завершения показа всплывающей карточки пользователем ${result}`)
      return;
    } catch(e){
      this.logger.error(`Ошибка завершения показа карточки в Битриксе ${e}`)
    }

  }

  public async externalCallFinish(bitrixId: string,userId: string,billsec: string,callStatus:DispositionStatus | BitrixCallStatusType,callType:BitrixCallType,recording:string): Promise<any>{
    const data: BitrixExternalCallFinishRequest = {
      CALL_ID: bitrixId,
      USER_ID: Number(userId),
      DURATION: Number(billsec),
      STATUS_CODE: callStatus,
      TYPE: callType,
      RECORD_URL: `http://${this.configService.get('bitrix.custom.recordUrl')}/monitor/${recording}`
    }

    try{
      const { result } = (await this.httpService.post(`${this.bitrixUrl}${BitrixMetod.ExternalCallFinish}`,data).toPromise()).data;
      this.logger.info(`Результат завершения вызова${result}`)
      return result;
    } catch(e){
      this.logger.error(`Ошибка завершения вызова в Битриксе ${e}`)
    }
  }

  public async getActivity(id : any): Promise<any>{
    const data : GetActivity = {
      ID: id
    }

    try{
      const { result } = (await this.httpService.post(`${this.bitrixUrl}${BitrixMetod.CrmActivityGet}`,data).toPromise()).data;
      this.logger.info(`Результат getActivity ${result}`)
      return result;
    } catch(e){
      this.logger.error(`Ошибка getActivity в Битриксе ${e}`)
    }

  }

  public async updateActivity(author: string, responsibleId: string){
    const data: GetActivity = {
      "ID": author,
      "fields": {
          "AUTHOR_ID": responsibleId,
          "RESPONSIBLE_ID": responsibleId
      }
    };

    try{
      const { result } = (await this.httpService.post(`${this.bitrixUrl}${BitrixMetod.CrmActivitUypdate}`,data).toPromise()).data;
      this.logger.info(`Результат updateActivity ${result}`)
      return result;
    } catch(e){
      this.logger.error(`Ошибка updateActivity в Битриксе ${e}`)
    }
  }


  public async createTask(incomingNumber: string, bitrixId: string){
    const data: BitrixTasksFields = {
      "fields": {
        "TITLE": "Пропущенный вызов",
        "RESPONSIBLE_ID": Number(bitrixId),
        "CREATED_BY": 1,
        "DESCRIPTION": `Пропущенный вызов от абонента ${incomingNumber}`,
        "PRIORITY": "2",
        "DEADLINE": moment().add(this.configService.get('bitrix.custom.deadLine'), 'minutes').format('YYYY-MM-DD H:mm:ss')
      }
    }

    try{
      const { result } = (await this.httpService.post(`${this.bitrixUrl}${BitrixMetod.TaskAdd}`,data).toPromise()).data;
      this.logger.info(`Результат createTask ${result}`)
      return result;
    } catch(e){
      this.logger.error(`Ошибка createTask в Битриксе ${e}`)
    }

  }

}