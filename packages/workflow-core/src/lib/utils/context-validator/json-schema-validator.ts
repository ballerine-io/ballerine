import { ISchemaValidator, TSchemaValidatorResponse, TValidationLogic } from './types';
import { AnyRecord } from '@ballerine/common';
import Ajv from 'ajv';

export class JsonSchemaValidator implements ISchemaValidator {
  validationLogic: TValidationLogic;
  data: AnyRecord;
  options: {};
  errorMessage?: string;
  constructor(
    validationLogic: TValidationLogic,
    data: AnyRecord,
    options: {},
    errorMessage?: string,
  ) {
    this.validationLogic = validationLogic;
    this.data = structuredClone(data);
    this.options = options;
    this.errorMessage = errorMessage;
  }

  validate(): TSchemaValidatorResponse {
    const ajv = new Ajv(this.options);
    const validator = ajv.compile(this.validationLogic);

    if (!validator(this.data)) {
      return Promise.resolve({ isValid: false, errorMessage: this.errorMessage || 'Bad Request' });
    }

    Promise.resolve({ isValid: true });
  }
}
