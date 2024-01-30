import * as common from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorObject } from 'ajv';
import startCase from 'lodash/startCase';
import lowerCase from 'lodash/lowerCase';
import { ZodError } from 'zod';

export class ForbiddenException extends common.ForbiddenException {
  @ApiProperty()
  statusCode!: number;
  @ApiProperty()
  message!: string;
}

export class NotFoundException extends common.NotFoundException {
  @ApiProperty()
  statusCode!: number;
  @ApiProperty()
  message!: string;
}

export class SessionExpiredException extends common.UnauthorizedException {
  @ApiProperty()
  statusCode!: number;
  @ApiProperty()
  message!: string;
}

export class ZodValidationException extends common.BadRequestException {
  error: ZodError;

  constructor(error: ZodError) {
    super({
      statusCode: common.HttpStatus.BAD_REQUEST,
      message: error.errors, // Backwards compatibility - Legacy code message excepts array
      errors: error.errors,
    });
    this.error = error;
  }
  getZodError() {
    return this.error;
  }
}

export class AjvValidationError extends common.BadRequestException {
  @ApiProperty()
  statusCode!: number;
  @ApiProperty()
  message!: string;

  constructor(
    public error: ErrorObject<string, Record<string, any>, unknown>[] | null | undefined,
  ) {
    super();
  }

  serializeErrors() {
    return this.error?.map(({ instancePath, message }) => {
      return {
        message: `${startCase(lowerCase(instancePath)).replace('/', '')} ${message}.`,
        path: instancePath,
      };
    });
  }
}
