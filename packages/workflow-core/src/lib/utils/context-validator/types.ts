import { AnyRecord } from '@ballerine/common';

export type TSchemaValidatorResponse = Promise<{ isValid: boolean; errorMessage?: string }>;
export type TJsonSchema = AnyRecord;
export type TValidationLogic = TJsonSchema;
export abstract class BaseSchemaValidator {
  abstract name: string;
  type = 'schema-validator';

  abstract validate(
    data: AnyRecord,
    validationLogic: TValidationLogic,
    options: AnyRecord,
    errorMessage?: string,
  ): TSchemaValidatorResponse;
}
