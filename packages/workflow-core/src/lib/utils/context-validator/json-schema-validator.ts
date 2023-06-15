import { ISchemaValidator, TSchemaValidatorResponse, TValidationLogic } from './types';
import { AnyRecord } from '@ballerine/common';
import Ajv from 'ajv';

export class JsonSchemaValidator implements ISchemaValidator {
  validationLogic: TValidationLogic;
  data: AnyRecord;
  options: {};
  constructor(validationLogic: TValidationLogic, data: AnyRecord, options: {}) {
    this.validationLogic = structuredClone(validationLogic);
    this.data = data;
    this.options = options;
  }

  validate(): TSchemaValidatorResponse {
    const ajv = new Ajv(this.options);
    const validator = ajv.compile(this.validationLogic);
    validator(this.data);
  }
}
