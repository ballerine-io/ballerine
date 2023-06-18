import { BaseSchemaValidator, TSchemaValidatorResponse, TValidationLogic } from './types';
import Ajv from 'ajv';
import { AnyRecord } from '@ballerine/common';

export class JsonSchemaValidator extends BaseSchemaValidator {
  name = 'json-schema-validator';

  async validate(
    data: AnyRecord,
    validationLogic: TValidationLogic,
    options: AnyRecord = { allErrors: true },
    errorMessage?: string,
  ): TSchemaValidatorResponse {
    const validator = new Ajv(options);
    const validationResult = validator.validate(validationLogic, data);

    if (!validationResult) {
      const validationErrorMessage = validator.errors?.map(error => error.message).join(' | ');
      return { isValid: false, errorMessage: validationErrorMessage };
    }

    return { isValid: true };
  }
}
