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
  constructor(public error: ZodError) {
    super({
      statusCode: common.HttpStatus.BAD_REQUEST,
      message: error.errors, // Backwards compatibility - Legacy code message excepts array
      errors: error.errors,
    });
    this.error = error;
  }
  getError() {
    return this.error;
  }
}

export class AjvValidationError extends common.BadRequestException {
  constructor(
    public error: ErrorObject<string, Record<string, any>, unknown>[] | null | undefined,
  ) {
    const errors = error?.map(({ instancePath, message }) => {
      return {
        message: `${startCase(lowerCase(instancePath)).replace('/', '')} ${message}.`,
        path: instancePath,
      };
    });

    super({
      statusCode: common.HttpStatus.BAD_REQUEST,
      message: errors, // Backwards compatibility - Legacy code message excepts array
      errors: errors,
    });
    this.error = error;
  }

  getError() {
    return this.error;
  }
}
