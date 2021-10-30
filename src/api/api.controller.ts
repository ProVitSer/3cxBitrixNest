import { LoggerService } from "@app/logger/logger.service";
import { Controller, Query, Req, Res, Get, Inject, Body, Post } from "@nestjs/common";
import { Response } from "express";
import { ApiService } from "./api.service";
import { OnExternalCallStart } from "@app/bitrix/types/interfaces";

@Controller("api")
export class ApiController {
  constructor(
    private readonly logger: LoggerService,
    private readonly service: ApiService
  ) {}

  @Post("call")
  async amiCall(
    @Req() req: any,
    @Res() res: Response,
    @Body() initCallRequest: OnExternalCallStart
  ): Promise<void> {
    try{
        // await this.service.sendAmiCall(initCallRequest);
        res.sendStatus(200);
    }catch(e){
        this.logger.error(`Проблемы отправки вызова через AMI`)
        res.sendStatus(503).end();
    }
  }
}
