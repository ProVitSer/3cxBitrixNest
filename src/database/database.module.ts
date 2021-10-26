import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
        entities: [],
        synchronize: true,
      }),
  ],
  providers: [DatabaseService]
})
export class DatabaseModule {}
