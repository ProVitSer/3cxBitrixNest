import { BitrixService } from "@app/bitrix/bitrix.service";
import { LoggerService } from "@app/logger/logger.service";
import { forwardRef, Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import {
  Event,
  EndCrmCall,
  EndIncomigCall,
  EndOutgoingCall,
  EventEmitterType,
  StartIncomingCall,
} from "./types/interfaces";

@Injectable()
export class AmiEventsHandlers {
  constructor(
      private readonly log: LoggerService,
      private readonly bitrix: BitrixService

    ) {}

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  @OnEvent(EventEmitterType.OutgoingCall)
  async outgoing(event: EndOutgoingCall) {
    this.log.info(`Завершился исходящий вызов на Asterisk ${event}`);
    await this.sleep(40000);
    return await this.bitrix.sendCallInfoByOutgoingCall(event.appdata as EndOutgoingCall)

  }

  @OnEvent(EventEmitterType.IncomingCall)
  async incoming(event: EndIncomigCall) {
    this.log.info(`Завершился входящий вызов на Asterisk ${event}`);
    await this.sleep(50000);
    return await this.bitrix.sendInfoByIncomingCall(event.appdata as EndIncomigCall)
  }

  @OnEvent(EventEmitterType.CrmCall)
  async crmCall(event: Event) {
    this.log.info(`Завершился исходящий вызов на Asterisk через CRM ${event}`);
    await this.sleep(20000);
    return await this.bitrix.sendCallInfoByOutgoingCRMCall(event.appdata as EndCrmCall)
  }

  @OnEvent(EventEmitterType.InitIncomingCall)
  async initIncoming(event: Event) {
    this.log.info(`Входящий звонок на Asterisk ${event}`);
    const {unicueid ,incomingNumber,callId} = event.appdata as StartIncomingCall;
    return await this.bitrix.registerCallIdInBitrixAndShow(unicueid ,incomingNumber,callId)
  }
}
