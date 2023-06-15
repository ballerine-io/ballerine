import { AnyRecord } from '@ballerine/common';

export type TSchemaValidatorResponse = Promise<{ isValid: boolean; errorMessage?: string }>;
export type TJsonSchema = AnyRecord
export type TValidationLogic = TJsonSchema;
export abstract class BaseSchemaValidator {
  abstract name: string;
  type = 'schema-validator';
  data: AnyRecord;
  validationLogic: TValidationLogic;
  options: {};
  errorMessage?: string;

  abstract validate(): TSchemaValidatorResponse;

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
}
