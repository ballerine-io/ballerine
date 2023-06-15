import { AnyRecord, IErrorWithMessage } from '@ballerine/common';

export type TSchemaValidatorResponse = Promise<true> | Promise<IErrorWithMessage>;
export type TJsonSchema = string;
export type TValidationLogic = TJsonSchema;

export interface ISchemaValidator {
  data: AnyRecord;
  validationLogic: TValidationLogic;
  options: {};

  validate(): TSchemaValidatorResponse;
}
