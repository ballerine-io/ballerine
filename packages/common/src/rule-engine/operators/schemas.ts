import { z } from 'zod';
import { OPERATION } from './enums';

export const PrimitiveSchema = z.union([z.number(), z.string(), z.boolean()]);

export const PrimitiveArraySchema = z.array(z.union([z.number(), z.string(), z.boolean()]));

export const BetweenSchema = z.object({
  min: PrimitiveSchema,
  max: PrimitiveSchema,
});

export const LastYearsSchema = z.object({
  years: z.number().positive(),
});

// TODO: TBD
const ruleSchema = z.object({
  key: z.string(),
  operation: z.literal(OPERATION.LAST_YEAR),
  value: z.object({
    years: z.number(),
  }),
});
