import { z, ZodSchema } from 'zod';
import { BaseOperationsValueSchema } from './constants';

export const PrimitiveSchema = z.union([z.number(), z.string(), z.boolean()]);

export const PrimitiveArraySchema = z.array(z.union([z.number(), z.string(), z.boolean()]));

export const BetweenSchema = z.object({
  min: PrimitiveSchema,
  max: PrimitiveSchema,
});

export const LastYearsSchema = z.object({
  years: z.number().positive(),
});

export const ExistsSchema = z.object({
  schema: z.any().refine(
    (val: any): val is ZodSchema<any> => {
      return val instanceof ZodSchema;
    },
    {
      message: 'Value must be a Zod schema',
    },
  ),
});

export const AmlCheckSchema = z
  .object({
    key: z.string().optional(),
  })
  .and(BaseOperationsValueSchema);
