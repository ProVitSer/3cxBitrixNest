import { LoggerService } from '@app/logger/logger.service';
import { LowdbService } from '@app/lowdb/lowdb.service';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron,CronExpression } from '@nestjs/schedule';

@Injectable()
export class SyncDataService implements OnApplicationBootstrap{
    constructor(
        private readonly logger: LoggerService,
        private readonly lowdb: LowdbService
      ) {}

      
    onApplicationBootstrap() {
        this.syncBitrixInfo();
    }

      @Cron(CronExpression.EVERY_DAY_AT_11PM)
      syncBitrixInfo() {
      }

}
