import { z } from 'zod';

import { OPERATION, OPERATOR } from '../operators/enums';
import { OperationsValueSchema } from '../operators/constants';
import { RuleSet } from './types';
import { AmlCheckSchema } from '../operators/schemas';

export function getValues<T extends Record<string, unknown>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]];
}

export const RuleSchema = z
  .object({
    key: z.string(),
    operator: z.enum(getValues(OPERATION)),
  })
  .and(OperationsValueSchema);

// @ts-ignore - cycle zod types are not correct
export const RuleSetSchema: z.ZodType<RuleSet> = z.object({
  operator: z.enum(getValues(OPERATOR)),
  rules: z.lazy(() => z.array(z.union([RuleSetSchema, RuleSchema]))),
});
