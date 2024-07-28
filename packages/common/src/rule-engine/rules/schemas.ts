import { z } from 'zod';

import { OPERATION, OPERATOR } from '../operators/enums';
import { RuleSet } from './types';
import {
  AmlCheckSchema,
  BetweenSchema,
  ExistsSchema,
  LastYearsSchema,
  PrimitiveArraySchema,
  PrimitiveSchema,
} from '../operators/schemas';

export function getValues<T extends Record<string, unknown>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]];
}

export const RuleSchema = z.discriminatedUnion('operator', [
  z.object({
    key: z.string(),
    operator: z.literal(OPERATION.LAST_YEAR),
    value: LastYearsSchema,
  }),
  z.object({
    key: z.enum([
      'countries.length',
      'matchTypes.length',
      'warnings.length',
      'sanctions.length',
      'fitnessProbity.length',
      'pep.length',
      'adverseMedia.length',
    ]),
    operator: z.literal(OPERATION.AML_CHECK),
    value: AmlCheckSchema,
  }),
  z.object({
    key: z.string(),
    operator: z.literal(OPERATION.EQUALS),
    value: PrimitiveSchema,
  }),
  z.object({
    key: z.string(),
    operator: z.literal(OPERATION.NOT_EQUALS),
    value: PrimitiveSchema,
  }),
  z.object({
    key: z.string(),
    operator: z.literal(OPERATION.BETWEEN),
    value: BetweenSchema,
  }),
  z.object({
    key: z.string(),
    operator: z.literal(OPERATION.GT),
    value: PrimitiveSchema,
  }),
  z.object({
    key: z.string(),
    operator: z.literal(OPERATION.LT),
    value: PrimitiveSchema,
  }),
  z.object({
    key: z.string(),
    operator: z.literal(OPERATION.GTE),
    value: PrimitiveSchema,
  }),
  z.object({
    key: z.string(),
    operator: z.literal(OPERATION.LTE),
    value: PrimitiveSchema,
  }),
  z.object({
    key: z.string(),
    operator: z.literal(OPERATION.EXISTS),
    value: ExistsSchema,
  }),
  z.object({
    key: z.string(),
    operator: z.literal(OPERATION.IN),
    value: PrimitiveArraySchema,
  }),
  z.object({
    key: z.string(),
    operator: z.literal(OPERATION.NOT_IN),
    value: PrimitiveArraySchema,
  }),
]);

// @ts-ignore - cycle zod types are not correct
export const RuleSetSchema: z.ZodType<RuleSet> = z.object({
  operator: z.enum(getValues(OPERATOR)),
  rules: z.lazy(() => z.array(z.union([RuleSetSchema, RuleSchema]))),
});
