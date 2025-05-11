import { z, ZodSchema } from 'zod';

import {
  AmlCheckSchema,
  BetweenSchema,
  LastYearsSchema,
  PrimitiveSchema,
  IdvCheckSchema,
  UboMismatchSchema,
  AmlCheckV2Schema,
} from '@/rule-engine/operators/schemas';

import { OPERATION, OPERATOR } from './enums';

export type TOperation = (typeof OPERATION)[keyof typeof OPERATION];

export type TOperator = (typeof OPERATOR)[keyof typeof OPERATOR];

export type Primitive = z.infer<typeof PrimitiveSchema>;

export type BetweenParams = z.infer<typeof BetweenSchema>;

export type LastYearsParams = z.infer<typeof LastYearsSchema>;

export type AmlCheckParams = z.infer<typeof AmlCheckSchema>;

export type AmlCheckV2Params = z.infer<typeof AmlCheckV2Schema>;

export type IdvCheckParams = z.infer<typeof IdvCheckSchema>;

export type UboMismatchParams = z.infer<typeof UboMismatchSchema>;

export type ExistsParams = {
  schema?: ZodSchema;
};

export type ConditionFn<TValue = Primitive, TData = Primitive> = (
  value: TValue,
  data: TData,
) => boolean;

export interface IConditionHelpers<T> {
  [key: string]: ConditionFn<T>;
}

export interface CompanySanctionsCategoriesParams {
  threshold?: number; // Optional threshold for number of adverse media sources required to trigger the rule
  category: string;
}
