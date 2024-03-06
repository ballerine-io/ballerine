import { ZodTypeAny } from 'zod';

export const zodBuilder =
  <TType>() =>
  <TSchema extends ZodTypeAny & { _output: TType }>(schema: TSchema) =>
    schema;
