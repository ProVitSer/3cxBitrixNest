import { LoggerService } from '@app/logger/logger.service';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OnEvent } from '@nestjs/event-emitter';
import { eventTypeMap, AsteriskContextEventType, EventEmitterType } from './types/interfaces';
export interface PlainObject { [key: string]: any }


@Injectable()
export class AmiService implements OnApplicationBootstrap {
    private client: any;

    constructor(
        @Inject('AMI') private readonly ami: any,
        private readonly configService: ConfigService,
        private readonly log: LoggerService,
        private eventEmitter: EventEmitter2
    ) {
    }

    public async onApplicationBootstrap() {
        try {
            this.client = await this.ami;
            this.client.logLevel = this.configService.get('asterisk.ami.logLevel');
            this.client.open();
            this.client.on('namiConnected', () => this.log.info('Подключение к AMI успешно установлено'));
            this.client.on('namiConnectionClose', () => this.connectionClose());
            this.client.on('namiLoginIncorrect', () => this.loginIncorrect());
            this.client.on('namiInvalidPeer', () => this.invalidPeer());
            this.client.on('namiEventNewexten', (event: PlainObject) => {
                (event.application == 'NoOp') ? this.eventEmitter.emit(this.getEventType(event), event) : null;
            })
        } catch (e) {
            this.log.error(`AMI onApplicationBootstrap ${e}`)
        }

    };

    private connectionClose() {
        this.log.error(`Переподключение к AMI ...`);
        setTimeout(() => {
            this.client.open();
        }, 5000);
    }

    private loginIncorrect() {
        this.log.error(`Некорректный логин или пароль от AMI`);
        process.exit();
    }

    private invalidPeer() {
        this.log.error(`Invalid AMI Salute. Not an AMI?`);
        process.exit();
    }

    private getEventType(event: PlainObject): EventEmitterType {
        return eventTypeMap[event.context as AsteriskContextEventType]
    }

    public async sendAmiCall(bitrixId: string, localExtension: string, outgoingNumber: string) {
        this.log.info(`Исходящий вызов из webhook CRM: ID ${bitrixId} внутренний номер ${localExtension} внешний номер ${outgoingNumber}`);
        const action = new this.ami.Actions.Originate();
        action.channel = '';//`local/${localExtension}:${outgoingNumber}@${config.context.bridge3CX}`; 
        action.callerid = outgoingNumber;
        action.priority = '1';
        action.timeout = '20000';
        action.context = '';//config.context.crmCall;
        action.exten = `${outgoingNumber.slice(1)}`;
        action.variable = `var1=${outgoingNumber},var2=${localExtension},var3=${bitrixId}`;
        action.async = 'yes';
        const resultInitCall = await this.client.send(action);
        this.log.info(`Результат инициации вызова ${resultInitCall}`);

    }

}