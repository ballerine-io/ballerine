import { AnyRecord } from '@ballerine/common';
import { TSchemaValidatorResponse } from './types';

export abstract class BaseSchemaValidator {
  abstract name: string;
  type = 'schema-validator';

  abstract validate(
    data: AnyRecord,
    options: AnyRecord,
    errorMessage?: string,
  ): TSchemaValidatorResponse;
}
