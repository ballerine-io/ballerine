import { z, ZodSchema } from 'zod';

import {
  AmlCheckSchema,
  BetweenSchema,
  LastYearsSchema,
  PrimitiveSchema,
} from '@/rule-engine/operators/schemas';
import { OperationHelpers } from './constants';
import { OPERATION, OPERATOR } from './enums';

export type TOperation = (typeof OPERATION)[keyof typeof OPERATION];

export type TOperator = (typeof OPERATOR)[keyof typeof OPERATOR];

export type OperationHelper = (typeof OperationHelpers)[keyof typeof OperationHelpers];

export type Primitive = z.infer<typeof PrimitiveSchema>;

export type BetweenParams = z.infer<typeof BetweenSchema>;

export type LastYearsParams = z.infer<typeof LastYearsSchema>;

export type AmlCheckParams = z.infer<typeof AmlCheckSchema>;

export type ExistsParams = {
  schema?: ZodSchema;
};
export type ConditionFn<T = Primitive> = (value: Primitive, param: T) => boolean;

export interface IConditionHelpers<T> {
  [key: string]: ConditionFn<T>;
}
