import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // if (host.getType() === 'http') return;
    console.error('Global error handler: ', exception);
    super.catch(exception, host);
  }
}
