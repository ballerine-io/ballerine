import { AnyRecord } from '@ballerine/common';

export type TSchemaValidatorResponse = Promise<{ isValid: boolean; errorMessage?: string }>;
export type TJsonSchema = AnyRecord;
export type TValidationLogic = TJsonSchema;
