import { Module } from "@nestjs/common";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { AmiService } from "./ami.service";
import * as namiLib from "nami";
import { LoggerModule } from "../logger/logger.module";

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [
    {
      provide: "AMI",
      useFactory: async (configService: ConfigService) => {
        return new namiLib.Nami({
          username: configService.get("asterisk.ami.username"),
          secret: configService.get("asterisk.ami.password"),
          host: configService.get("asterisk.ami.host"),
          port: configService.get("asterisk.ami.port"),
        });
      },
      inject: [ConfigService],
    },
    AmiService,
  ],
  exports: ["AMI", AmiService],
})
export class AmiModule {}
