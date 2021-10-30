import { ApiModule } from '@app/api/api.module';
import { LoggerModule } from '@app/logger/logger.module';
import { LowdbModule } from '@app/lowdb/lowdb.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BitrixService } from './bitrix.service';

@Module({
  imports:[ConfigModule, LoggerModule, LowdbModule, ApiModule],
  providers: [BitrixService],
  exports:[BitrixService]
})
export class BitrixModule {}
