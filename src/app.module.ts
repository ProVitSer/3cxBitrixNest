import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '@app/config/config.provides';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerService } from './logger/logger.service';
import { LoggerModule } from './logger/logger.module';
import { LowdbService } from './lowdb/lowdb.service';
import { LowdbModule } from './lowdb/lowdb.module';
import { AmiModule } from './ami/ami.module';
import { DatabaseModule } from './database/database.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ApiModule } from './api/api.module';
import { SyncDataModule } from './sync-data/sync-data.module';
import { BitrixModule } from './bitrix/bitrix.module';


@Module({
  imports: [
      ConfigModule.forRoot({ load: [configuration] }),
      EventEmitterModule.forRoot(),
      LoggerModule,
      LowdbModule,
      ApiModule,
      SyncDataModule,
      BitrixModule,
      AmiModule,
      //DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule],
})
export class AppModule { }
