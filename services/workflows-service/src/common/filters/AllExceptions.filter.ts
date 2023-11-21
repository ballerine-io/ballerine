import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(private readonly logger: AppLoggerService, applicationRef?: HttpAdapterHost) {
    super(applicationRef?.httpAdapter);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    // if (host.getType() === 'http') return;
    this.logger.error('Global error handler: ', exception as object);

    const response = host.switchToHttp().getResponse<Response>();
    if (exception instanceof UnauthorizedException) {
      // Clear the cookie
      response.clearCookie('session'); // Replace 'your_cookie_name' with the actual name of your cookie
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
