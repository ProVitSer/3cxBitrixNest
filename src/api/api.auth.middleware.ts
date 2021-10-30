import { Request, Response, NextFunction } from "express";
import { LoggerService } from "@app/logger/logger.service";
import { NestMiddleware, Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class BitrixAuthMiddleware implements NestMiddleware {
  constructor(
      private logger: LoggerService,
      private readonly configService: ConfigService,

      ) {}

  use(req: any, res: Response, next: Function) {
    const { body } = req;
    this.logger.info(body);
    (body.event == this.configService.get('bitrix.custom.event') && 
    body.auth.application_token == this.configService.get('bitrix.token'))?
    next():
    res.sendStatus(500); 
  }
}
