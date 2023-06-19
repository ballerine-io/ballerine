import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

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
