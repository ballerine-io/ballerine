import { z } from 'zod';

export const CollectionFlowRuleEnginesSchema = z.union([
  z.literal('json-logic'),
  z.literal('json-schema'),
]);

export type TRuleEngine = z.infer<typeof CollectionFlowRuleEnginesSchema>;

export const CollectionFlowRuleSchema = z.object({
  engine: CollectionFlowRuleEnginesSchema,
  value: z.any(),
  params: z.any().optional(),
});

export type TRule = z.infer<typeof CollectionFlowRuleSchema>;
