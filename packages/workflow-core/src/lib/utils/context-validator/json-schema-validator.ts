import { BaseSchemaValidator, TSchemaValidatorResponse } from './types';
import Ajv from 'ajv';

export class JsonSchemaValidator extends BaseSchemaValidator {
  name = "json-schema-validator";

  validate(): TSchemaValidatorResponse {
    const ajv = new Ajv(this.options);
    const validator = ajv.compile(this.validationLogic);

    if (!validator(this.data)) {
      return Promise.resolve({ isValid: false, errorMessage: this.errorMessage || 'Bad Request' });
    }

    return Promise.resolve({ isValid: true });
  }

}
