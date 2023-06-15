import { AnyRecord } from '@ballerine/common';

export type TSchemaValidatorResponse = Promise<{ isValid: boolean; errorMessage?: string }>;
export type TJsonSchema = string;
export type TValidationLogic = TJsonSchema;

export interface ISchemaValidator {
  data: AnyRecord;
  validationLogic: TValidationLogic;
  options: {};
  errorMessage?: string;

  validate(): TSchemaValidatorResponse;
}
