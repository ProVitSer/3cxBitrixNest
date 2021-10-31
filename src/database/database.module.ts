import { Module } from "@nestjs/common";
import {  DatabaseService } from "./database.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClCalls } from "./entities/ClCalls";
import { ClParticipants } from "./entities/ClParticipants";
import { ClPartyInfo } from "./entities/ClPartyInfo";
import { ClSegments } from "./entities/ClSegments";
import { CallcentQueuecalls } from "./entities/CallcentQueuecalls";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "",
      host: "",
      port: 5432,
      username: "",
      password: "",
      database: "",
      entities: [ ClParticipants,ClPartyInfo,ClSegments,ClCalls,CallcentQueuecalls],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ClParticipants,ClPartyInfo,ClSegments,ClCalls,CallcentQueuecalls]),
  ],
  providers: [DatabaseService],
  exports:[DatabaseService]
})
export class DatabaseModule {}
