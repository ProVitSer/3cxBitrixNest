import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Calldetails } from './entities/Calldetails';
import { Callhistory3 } from './entities/Callhistory3';
import { ClCalls } from './entities/ClCalls';
import { ClParticipants } from './entities/ClParticipants';
import { ClPartyInfo } from './entities/ClPartyInfo';
import { ClSegments } from './entities/ClSegments';

@Module({
  imports: [
    TypeOrmModule.forRoot({
        name: 'postgres',
        type: 'postgres',
        host: '193.178.170.28',
        port: 5432,
        username: 'phonesystem',
        password: 'Hb3OZWVQoeog',
        database: 'database_single',
        entities: [Calldetails,Callhistory3,ClCalls,ClParticipants,ClPartyInfo,ClSegments],
        synchronize: true,
      }),
  ],
  providers: [DatabaseService]
})
export class DatabaseModule {}
