import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import RedirectingException from './redirecting.exception';

@Catch(RedirectingException)
export class RedirectingExceptionFilter implements ExceptionFilter {
  catch(exception: RedirectingException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.redirect(exception.url);
  }
}
