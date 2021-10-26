import { AmiService } from "@app/ami/ami.service";
import { LoggerService } from "@app/logger/logger.service";
import { LowdbService } from "@app/lowdb/lowdb.service";
import { Inject, Injectable } from "@nestjs/common";
import { OnExternalCallStart } from "./types/interfaces";

@Injectable()
export class ApiService {
  constructor(
    private readonly logger: LoggerService,
    @Inject('AMI') private readonly ami: AmiService,
    private readonly lowdb: LowdbService
  ) {}

  async sendAmiCall(callInfo: OnExternalCallStart) {
    const { USER_ID, PHONE_NUMBER, CALL_ID } = callInfo;
    const extensionId = await this.lowdb.findById(String(USER_ID), "users");
    return await this.ami.sendAmiCall(CALL_ID,extensionId,PHONE_NUMBER);
  }
}
