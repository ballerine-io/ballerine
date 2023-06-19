import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(private readonly logger: AppLoggerService, applicationRef?: HttpAdapterHost) {
    super(applicationRef?.httpAdapter);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    // if (host.getType() === 'http') return;
    console.error('Global error handler: ', exception);
    super.catch(exception, host);

    const response = host.switchToHttp().getResponse<Response>();

    this.logger.log(`Outgoing response`, {
      request: {
        id: response.req.id,
      },
      response: {
        statusCode: response.statusCode,
      },
      responseTime: Date.now() - response.req.startTime,
    });
  }
}
