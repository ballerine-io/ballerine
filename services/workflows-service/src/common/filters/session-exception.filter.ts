import util from 'util';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { Request, Response, response } from 'express';
import { SessionExpiredException } from '@/errors';

@Catch(SessionExpiredException, UnauthorizedException)
export class SessionExpiredExceptionFilter extends BaseExceptionFilter {
  constructor(private readonly logger: AppLoggerService, applicationRef?: HttpAdapterHost) {
    super(applicationRef?.httpAdapter);
  }

  async catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const req = context.getRequest<Request>();
    const response = context.getRequest<Response>();

    if (req.session?.passport?.user) {
      const asyncLogout = util.promisify(req.logout.bind(req));
      await asyncLogout();

      response.clearCookie('session');
      response.clearCookie('session.sig');
    }

    super.catch(exception, host);
  }
}
