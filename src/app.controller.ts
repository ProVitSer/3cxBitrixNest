import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api/api.service';
import { AppService } from './app.service';
import { LowdbService } from './lowdb/lowdb.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly lowdb : LowdbService,
    private readonly http : ApiService
    ) {}

  @Get()
  async getHello(): Promise<any> {
    this.http.getUserIdDepartment('8008')
    
    }
}
