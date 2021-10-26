import { Module } from '@nestjs/common';
import { HttpModule } from "@nestjs/axios";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from "@app/logger/logger.module";
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { AmiModule } from '@app/ami/ami.module';
import { LowdbModule } from '@app/lowdb/lowdb.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    AmiModule,
    LowdbModule,
    HttpModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
            headers: {
                'User-Agent': 'ProVitSer/1.0.2',
                'Content-Type': 'application/json',
            },
        }),
        inject: [ConfigService],
    })],
  providers: [ApiService],
  controllers: [ApiController]
})
export class ApiModule {}