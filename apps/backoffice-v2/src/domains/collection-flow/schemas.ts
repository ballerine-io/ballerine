import { CollectionFlowStatusesEnum, CollectionFlowStepStatesEnum } from '@ballerine/common';
import { z } from 'zod';

export const CollectionFlowStateStepSchema = z.object({
  stepName: z.string(),
  state: z.nativeEnum(CollectionFlowStepStatesEnum),
  reason: z.string().optional(),
});

export type TCollectionFlowStateStep = z.infer<typeof CollectionFlowStateStepSchema>;

export const CollectionFlowStateSchema = z.object({
  currentStep: z.string(),
  steps: z.array(CollectionFlowStateStepSchema),
  status: z.nativeEnum(CollectionFlowStatusesEnum),
});

export type TCollectionFlowState = z.infer<typeof CollectionFlowStateSchema>;
