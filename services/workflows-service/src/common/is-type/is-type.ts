import { z, ZodSchema } from 'zod';

/**
 * Checks if the input matches the schema. By using a type predicate, this
 * function can be used as a type guard.
 *
 * @template TSchema The type of the Zod schema.
 *
 * @param {TSchema} schema The schema to be used.
 * @returns {function(input: unknown): input is z.output<TSchema>} A function that takes an input and returns whether the input matches the schema.
 */
export const isType =
  <TSchema extends ZodSchema>(schema: TSchema) =>
  (input: unknown): input is z.output<TSchema> => {
    return schema.safeParse(input).success;
  };
