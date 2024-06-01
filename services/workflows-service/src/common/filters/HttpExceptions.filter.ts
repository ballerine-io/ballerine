import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { PRISMA_UNIQUE_CONSTRAINT_ERROR } from '@/prisma/prisma.util';

export type ErrorCodesStatusMapping = {
  [key: string]: (typeof HttpStatus)[keyof typeof HttpStatus];
};

/**
 * {@link PrismaClientExceptionFilter} handling {@link Prisma.PrismaClientKnownRequestError} exceptions.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class HttpExceptionFilter extends BaseExceptionFilter {
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
    const statusCode = errorCodesStatusMapping[exception.code] ?? 500;
    let message = '';

    if (host.getType() === 'http') {
      message = getErrorMessageFromPrismaError(exception);

      if (!Object.keys(errorCodesStatusMapping).includes(exception.code)) {
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
}

/**
 * default error codes mapping
 *
 * Error codes definition for Prisma Client (Query Engine)
 * @see https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
 */
export const errorCodesStatusMapping: ErrorCodesStatusMapping = {
  P2000: HttpStatus.BAD_REQUEST,
  P2002: HttpStatus.CONFLICT,
  P2025: HttpStatus.NOT_FOUND,
};

export const getErrorMessageFromPrismaError = (error: Prisma.PrismaClientKnownRequestError) => {
  if (error.code === PRISMA_UNIQUE_CONSTRAINT_ERROR) {
    const fields = (error.meta as { target: string[] }).target;
    return `Another record with the requested (${fields.join(', ')}) already exists`;
  } else {
    return `[${error.code}]: ` + exceptionShortMessage(error.message);
  }
};

/**
 * @param exception
 * @returns short message for the exception
 */
export const exceptionShortMessage = (message: string): string => {
  const shortMessage = message.substring(message.indexOf('→'));

  return shortMessage.substring(shortMessage.indexOf('\n')).replace(/\n/g, '').trim();
};
