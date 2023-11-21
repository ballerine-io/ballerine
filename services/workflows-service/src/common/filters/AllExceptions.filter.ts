import util from 'util';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import { SessionExpiredException } from '@/errors';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(private readonly logger: AppLoggerService, applicationRef?: HttpAdapterHost) {
    super(applicationRef?.httpAdapter);
  }

  async catch(exception: unknown, host: ArgumentsHost) {
    // if (host.getType() === 'http') return;
    this.logger.error('Global error handler: ', exception as object);

    const context = host.switchToHttp();
    const req = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    if (req.session?.passport?.user && exception instanceof SessionExpiredException) {
      const asyncLogout = util.promisify(req.logout.bind(req));
      await asyncLogout();
    }

    super.catch(exception, host);

    this.logger.error(`Outgoing response (Failure)`, {
      response: {
        statusCode: response.statusCode,
      },
      responseTime: Date.now() - response.req.startTime,
    });
  }
}
