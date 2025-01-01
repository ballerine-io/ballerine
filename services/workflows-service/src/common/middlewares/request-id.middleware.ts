import { Injectable, NestMiddleware } from '@nestjs/common';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { ClsService } from 'nestjs-cls';
import { env } from '@/env';
import { getReqMetadataObj, isRelevantRequest } from '../utils/request-response/request';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  constructor(private readonly cls: ClsService, private readonly logger: AppLoggerService) {}

  use(req: Request<unknown>, res: Response<unknown>, next: NextFunction) {
    const startTime = new Date();
    req.startTime = startTime.getTime();

    // TODO: Can we set decorators on req for specific routes, than ignore non relevant request using an annotation
    const isRelevantReq = isRelevantRequest(req.originalUrl) || env.LOG_LEVEL === 'debug';

    let reqMetadata: object;

    if (isRelevantReq) {
      reqMetadata = getReqMetadataObj(req);
      this.setReqId(req, res);
      this.logger.debug(`Incoming request`, reqMetadata);
    }

    const cleanup = () => {
      res.removeListener('finish', logFn);
      res.removeListener('close', abortFn);
      res.removeListener('error', errorFn);
    };

    const logFn = () => {
      const endTime = new Date();
      cleanup();

      if (isRelevantReq) {
        reqMetadata = {
          ...reqMetadata,
          statusCode: res.statusCode,
          // @ts-ignore TODO: ask omri to fix tslint
          endTime: endTime.toISOString(),
          responseTime: endTime.valueOf() - startTime.valueOf(),
        };

        this.logger.debug(`Outgoing response`, reqMetadata);
      }
    };

    const abortFn = () => {
      cleanup();
      this.logger.warn('Request aborted by the client', reqMetadata);
    };

    const errorFn = (error: Error) => {
      cleanup();
      this.logger.log(`Request pipeline error`, { error });
    };

    res.on('finish', logFn); // successful pipeline (regardless of its response)
    res.on('close', abortFn); // aborted pipeline
    res.on('error', errorFn); // pipeline internal error

    next();
  }

  private setReqId(req: Request<unknown>, res: Response<unknown>) {
    try {
      req.id = randomUUID();
      this.cls.set('requestId', req.id);
      res.setHeader('X-Request-ID', req.id);
    } catch (e) {
      // Mainly for debugging purposes. See https://github.com/Papooch/nestjs-cls/issues/67
      this.logger.error('Could not set requestId');
    }
  }
}
