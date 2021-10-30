import { Inject, Injectable } from "@nestjs/common";
import { AmiService } from "@app/ami/ami.service";
import { LoggerService } from "../logger/logger.service";
import { LowdbService } from "@app/lowdb/lowdb.service";
import { OnExternalCallStart,BitrixMetod, BitirxUserGet, ActiveUser } from "./types/interfaces";
import {WorkPosition} from './config';
import axios, { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiService {
  private baseURL = this.configService.get('bitrix.url');
  private hash = this.configService.get('bitrix.hash');
  private bitrixUrl = `https://${this.baseURL}/rest/2/${this.hash}/`

  constructor(   
    private readonly logger: LoggerService,
    @Inject('AMI') private readonly ami: AmiService,
    private readonly lowdb: LowdbService,
    private httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async sendAmiCall(callInfo: OnExternalCallStart) {
    const { USER_ID, PHONE_NUMBER, CALL_ID } = callInfo;
    const extensionId = await this.lowdb.findById(String(USER_ID), "users");
    return await this.ami.sendAmiCall(CALL_ID,extensionId,PHONE_NUMBER);
  }

  public async getUserIdDepartment(id: string) {
    const data = {
      "FILTER": {
        "UF_DEPARTMENT": id,
        "WORK_POSITION": WorkPosition
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
}