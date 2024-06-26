import { z } from 'zod';
import { BetweenSchema, LastYearsSchema, PrimitiveSchema } from '@/rule-engine/operators/schemas';

export type Primitive = z.infer<typeof PrimitiveSchema>;

export type BetweenParams = z.infer<typeof BetweenSchema>;

export type LastYearsParams = z.infer<typeof LastYearsSchema>;

export type ConditionFn<T = Primitive> = (value: Primitive, param: T) => boolean;

export interface IConditionHelpers {
  [key: string]: ConditionFn<any>;
}
