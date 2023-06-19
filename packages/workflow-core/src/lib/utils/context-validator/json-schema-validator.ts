import { BaseSchemaValidator, TSchemaValidatorResponse, TValidationLogic } from './types';
import Ajv from 'ajv';
import { AnyRecord } from '@ballerine/common';

export class JsonSchemaValidator extends BaseSchemaValidator {
  name = 'json-schema-validator';
  validationLogic: TValidationLogic;

  constructor(validationLogic: TValidationLogic) {
    super();
    this.validationLogic = validationLogic;
  }
  async validate(
    data: AnyRecord,
    options: AnyRecord = { allErrors: true },
    errorMessage?: string,
  ): TSchemaValidatorResponse {
    const validator = new Ajv(options);
    const validationResult = validator.validate(this.validationLogic, data);

    if (!validationResult) {
      const validationErrorMessage = validator.errors?.map(error => error.message).join(' | ');
      return { isValid: false, errorMessage: validationErrorMessage };
    }

    return { isValid: true };
  }
}
