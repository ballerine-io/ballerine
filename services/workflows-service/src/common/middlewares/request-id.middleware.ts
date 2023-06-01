import { Injectable, Logger, NestMiddleware, Scope } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

@Injectable({ scope: Scope.REQUEST })
export class RequestIdMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestIdMiddleware.name);

  use(request: Request, response: Response, next: NextFunction) {
    request.id = randomUUID();
    request.startTime = Date.now();

    const cleanHeaders = { ...request.headers };
    delete cleanHeaders.authorization;
    delete cleanHeaders.cookie;

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
