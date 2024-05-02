import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { PRISMA_UNIQUE_CONSTRAINT_ERROR } from '@/prisma/prisma.util';

export type ErrorCodesStatusMapping = {
  [key: string]: number;
};

/**
 * {@link PrismaClientExceptionFilter} handling {@link Prisma.PrismaClientKnownRequestError} exceptions.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class HttpExceptionFilter extends BaseExceptionFilter {
  /**
   * default error codes mapping
   *
   * Error codes definition for Prisma Client (Query Engine)
   * @see https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
   */
  private errorCodesStatusMapping: ErrorCodesStatusMapping = {
    P2000: HttpStatus.BAD_REQUEST,
    P2002: HttpStatus.CONFLICT,
    P2025: HttpStatus.NOT_FOUND,
  };

  /**
   * @param applicationRef
   */
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(applicationRef?: HttpAdapterHost) {
    super(applicationRef?.httpAdapter);
  }

  /**
   * @param exception
   * @param host
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const statusCode = this.errorCodesStatusMapping[exception.code] ?? 500;
    let message = '';

    if (host.getType() === 'http') {
      // for http requests (REST)
      // Todo : Add all other exception types and also add mapping
      if (exception.code === PRISMA_UNIQUE_CONSTRAINT_ERROR) {
        const fields = (exception.meta as { target: string[] }).target;
        message = `Another record with the requested (${fields.join(', ')}) already exists`;
      } else {
        message = `[${exception.code}]: ` + this.exceptionShortMessage(exception.message);
      }

      if (!Object.keys(this.errorCodesStatusMapping).includes(exception.code)) {
        return super.catch(exception, host);
      }

      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();

      return response.status(statusCode).json({
        statusCode,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    return super.catch(exception, host);
  }

  /**
   * @param exception
   * @returns short message for the exception
   */
  exceptionShortMessage(message: string): string {
    const shortMessage = message.substring(message.indexOf('→'));

    return shortMessage.substring(shortMessage.indexOf('\n')).replace(/\n/g, '').trim();
  }
}
