import {
  AML_CHECK,
  BETWEEN,
  EQUALS,
  EXISTS,
  GT,
  GTE,
  IN,
  LAST_YEAR,
  LT,
  LTE,
  NOT_EQUALS,
  NOT_IN,
} from './helpers';

import { z } from 'zod';
import { OPERATION } from './enums';
import {
  AmlCheckSchema,
  BetweenSchema,
  ExistsSchema,
  LastYearsSchema,
  PrimitiveArraySchema,
  PrimitiveSchema,
} from './schemas';

export const OperationHelpers = {
  [OPERATION.EQUALS]: EQUALS,
  [OPERATION.NOT_EQUALS]: NOT_EQUALS,
  [OPERATION.BETWEEN]: BETWEEN,
  [OPERATION.GT]: GT,
  [OPERATION.GTE]: GTE,
  [OPERATION.LT]: LT,
  [OPERATION.LTE]: LTE,
  [OPERATION.LAST_YEAR]: LAST_YEAR,
  [OPERATION.EXISTS]: EXISTS,
  [OPERATION.IN]: IN,
  [OPERATION.NOT_IN]: NOT_IN,
  [OPERATION.AML_CHECK]: AML_CHECK,
} as const;

export const BaseOperationsValueSchema = z.union([
  z.object({
    operator: z.literal(OPERATION.EQUALS),
    value: PrimitiveSchema,
  }),
  z.object({
    operator: z.literal(OPERATION.NOT_EQUALS),
    value: PrimitiveSchema,
  }),
  z.object({
    operator: z.literal(OPERATION.BETWEEN),
    value: BetweenSchema,
  }),
  // Add other operator-specific schemas here
  z.object({
    operator: z.literal(OPERATION.GT),
    value: PrimitiveSchema,
  }),
  z.object({
    operator: z.literal(OPERATION.LT),
    value: PrimitiveSchema,
  }),
  z.object({
    operator: z.literal(OPERATION.GTE),
    value: PrimitiveSchema,
  }),
  z.object({
    operator: z.literal(OPERATION.LTE),
    value: PrimitiveSchema,
  }),
  z.object({
    operator: z.literal(OPERATION.EXISTS),
    value: ExistsSchema,
  }),
  z.object({
    operator: z.literal(OPERATION.IN),
    value: PrimitiveArraySchema,
  }),
  z.object({
    operator: z.literal(OPERATION.NOT_IN),
    value: PrimitiveArraySchema,
  }),
]);

export const OperationsValueSchema = z.union([
  BaseOperationsValueSchema,
  z.object({
    operator: z.literal(OPERATION.LAST_YEAR),
    value: LastYearsSchema,
  }),
  z.object({
    key: z.string().optional(),
    operator: z.literal(OPERATION.AML_CHECK),
    value: AmlCheckSchema,
  }),
]);
