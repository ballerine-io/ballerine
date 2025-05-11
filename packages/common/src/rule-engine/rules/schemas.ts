import { z } from 'zod';

import { RuleSet } from './types';
import {
  OPERATION,
  OPERATOR,
  AmlCheckSchema,
  BetweenSchema,
  ExistsSchema,
  LastYearsSchema,
  PrimitiveArraySchema,
  PrimitiveSchema,
  IdvCheckSchema,
  CompanySanctionsCategoriesSchema,
  AmlCheckV2Schema,
} from '@/rule-engine';

export const getValues = <T extends Record<string, unknown>>(obj: T) => {
  return Object.values(obj) as [(typeof obj)[keyof T]];
};

const amlKeys = [
  'countries.length',
  'matchTypes.length',
  'warnings.length',
  'sanctions.length',
  'fitnessProbity.length',
  'pep.length',
  'adverseMedia.length',
] as const;

export const RuleSchema = z.discriminatedUnion('operator', [
  z.object({
    key: z.string(),
    operator: z.literal(OPERATION.LAST_YEAR),
    value: LastYearsSchema,
  }),
  z.object({
    key: z.enum(amlKeys),
    operator: z.literal(OPERATION.AML_CHECK),
    value: AmlCheckSchema,
  }),
  z.object({
    key: z.enum(amlKeys),
    operator: z.literal(OPERATION.AML_CHECK_V2),
    value: AmlCheckV2Schema,
  }),
  z.object({
    key: z.string().optional(),
    operator: z.literal(OPERATION.IDV_CHECK),
    value: IdvCheckSchema,
  }),
  z.object({
    key: z.string().optional(),
    operator: z.literal(OPERATION.COMPANY_SANCTIONS_CATEGORIES),
    value: CompanySanctionsCategoriesSchema,
  }),
  z.object({
    key: z.string(),
    operator: z.literal(OPERATION.EQUALS),
    value: PrimitiveSchema,
    isPathComparison: z.boolean().default(false),
  }),
  z.object({
    key: z.string(),
    operator: z.literal(OPERATION.NOT_EQUALS),
    value: PrimitiveSchema,
    isPathComparison: z.boolean().default(false),
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
    isPathComparison: z.boolean().default(false),
  }),
  z.object({
    key: z.string(),
    operator: z.literal(OPERATION.LT),
    value: PrimitiveSchema,
    isPathComparison: z.boolean().default(false),
  }),
  z.object({
    key: z.string(),
    operator: z.literal(OPERATION.GTE),
    value: PrimitiveSchema,
    isPathComparison: z.boolean().default(false),
  }),
  z.object({
    key: z.string(),
    operator: z.literal(OPERATION.LTE),
    value: PrimitiveSchema,
    isPathComparison: z.boolean().default(false),
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
    isPathComparison: z.boolean().default(false),
  }),
  z.object({
    key: z.string(),
    operator: z.literal(OPERATION.IN_CASE_INSENSITIVE),
    value: PrimitiveArraySchema,
    isPathComparison: z.boolean().default(false),
  }),
  z.object({
    key: z.string(),
    operator: z.literal(OPERATION.NOT_IN),
    value: PrimitiveArraySchema,
    isPathComparison: z.boolean().default(false),
  }),
  z.object({
    key: z.string(),
    operator: z.literal(OPERATION.FUZZY_MATCH_SCORE_LT),
    value: PrimitiveSchema,
    isPathComparison: z.boolean().default(false),
    threshold: z.number().min(0).max(100).default(80),
  }),
  z.object({
    key: z.string().optional(),
    operator: z.literal(OPERATION.UBO_MISMATCH),
    value: PrimitiveSchema.optional(),
    isPathComparison: z.boolean().default(false),
  }),
]);

// @ts-ignore - cycle zod types are not correct
export const RuleSetSchema: z.ZodType<RuleSet> = z.object({
  operator: z.enum(getValues(OPERATOR)),
  rules: z.lazy(() => z.array(z.union([RuleSetSchema, RuleSchema]))),
});
