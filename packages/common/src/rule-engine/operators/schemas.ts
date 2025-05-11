import { z, ZodSchema } from 'zod';
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
    operator: z.literal(OPERATION.IN),
    value: PrimitiveArraySchema,
  }),
  z.object({
    operator: z.literal(OPERATION.NOT_IN),
    value: PrimitiveArraySchema,
  }),
]);

export const AmlCheckSchema = z
  .object({
    childWorkflowName: z.string(),
  })
  .and(BaseOperationsValueSchema);

export const AmlCheckV2Schema = BaseOperationsValueSchema;

export const IdvCheckSchema = z.object({
  childWorkflowName: z.string(),
});

export const CompanySanctionsCategoriesSchema = z.object({
  threshold: z.number().optional(),
  category: z.union([z.literal('Adverse Media'), z.string()]),
});

export const UboMismatchSchema = z.object({
  operator: z.literal(OPERATION.UBO_MISMATCH),
});
