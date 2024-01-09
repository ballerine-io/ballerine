import * as common from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorObject } from 'ajv';
import startCase from 'lodash/startCase';
import lowerCase from 'lodash/lowerCase';

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
