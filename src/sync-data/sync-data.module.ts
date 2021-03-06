import { ApiModule } from '@app/api/api.module';
import { LoggerModule } from '@app/logger/logger.module';
import { LowdbModule } from '@app/lowdb/lowdb.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SyncDataService } from './sync-data.service';

@Module({
  imports: [LowdbModule, LoggerModule, ScheduleModule.forRoot(),ApiModule],
  exports: [SyncDataService],
  providers: [SyncDataService]
})
export class SyncDataModule {}
