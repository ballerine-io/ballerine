import { Injectable, NestMiddleware, Scope } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { ClsService } from 'nestjs-cls';
import { AppLoggerService } from '@/common/app-logger/app-loger.service';

@Injectable({ scope: Scope.REQUEST })
export class RequestIdMiddleware implements NestMiddleware {
  constructor(private readonly cls: ClsService, private readonly logger: AppLoggerService) {}

  use(request: Request, response: Response, next: NextFunction) {
    request.id = randomUUID();
    request.startTime = Date.now();

    const cleanHeaders = { ...request.headers };
    delete cleanHeaders.authorization;
    delete cleanHeaders.cookie;

    this.cls.set('requestId', request.id);

    this.logger.log(`Incoming request`, {
      request: {
        id: request.id,
        method: request.method,
        path: request.originalUrl,
        headers: cleanHeaders,
      },
    });

    next();
  }
}
