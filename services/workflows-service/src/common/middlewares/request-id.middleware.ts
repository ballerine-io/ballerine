import { Injectable, NestMiddleware, Scope } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { ClsService } from 'nestjs-cls';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';

@Injectable({ scope: Scope.REQUEST })
export class RequestIdMiddleware implements NestMiddleware {
  constructor(private readonly cls: ClsService, private readonly logger: AppLoggerService) {}

  use(request: Request, response: Response, next: NextFunction) {
    request.id = randomUUID();
    request.startTime = Date.now();

    const cleanHeaders = { ...request.headers };
    delete cleanHeaders.authorization;
    delete cleanHeaders.cookie;

    try {
      this.cls.set('requestId', request.id);

      response.setHeader('X-Request-ID', request.id);
    } catch (e) {
      // Mainly for debugging purposes. See https://github.com/Papooch/nestjs-cls/issues/67
      this.logger.log('Could not set requestId');
    }

    this.logger.log(`Incoming request`, {
      request: {
        method: request.method,
        path: request.originalUrl,
        headers: cleanHeaders,
      },
    });

    next();
  }
}
