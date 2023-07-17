import { TSchemaValidatorResponse, TValidationLogic } from './types';
import Ajv from 'ajv';
import { AnyRecord } from '@ballerine/common';
import { BaseSchemaValidator } from './base-schema-validator';

export class JsonSchemaValidator extends BaseSchemaValidator {
  name = 'json-schema-validator';
  schema: TValidationLogic;

  constructor(schema: TValidationLogic) {
    super();
    this.schema = schema;
  }
  async validate(
    data: AnyRecord,
    options: AnyRecord = { allErrors: true },
    errorMessage?: string,
  ): TSchemaValidatorResponse {
    const validator = new Ajv(options);
    const validationResult = validator.validate(this.schema, data);

    if (!validationResult) {
      const validationErrorMessage = validator.errors
        ?.map(error => `${error.instancePath} - ${error.message}`)
        .join(' | ');
      return { isValid: false, errorMessage: validationErrorMessage };
    }

    return { isValid: true };
  }
}
