import { CollectionFlowStatusesEnum, CollectionFlowStepStatesEnum } from '@ballerine/common';
import { z } from 'zod';

export const CollectionFlowStateStepSchema = z.object({
  stepName: z.string(),
  state: z.enum([
    CollectionFlowStepStatesEnum.idle,
    CollectionFlowStepStatesEnum.inProgress,
    CollectionFlowStepStatesEnum.completed,
    CollectionFlowStepStatesEnum.revision,
    CollectionFlowStepStatesEnum.revised,
    CollectionFlowStepStatesEnum.edit,
  ]),
  reason: z.string().optional(),
});

export type TCollectionFlowStateStep = z.infer<typeof CollectionFlowStateStepSchema>;

export const CollectionFlowStateSchema = z.object({
  currentStep: z.string(),
  steps: z.array(CollectionFlowStateStepSchema),
  status: z.enum([
    CollectionFlowStatusesEnum.pending,
    CollectionFlowStatusesEnum.inprogress,
    CollectionFlowStatusesEnum.completed,
    CollectionFlowStatusesEnum.edit,
    CollectionFlowStatusesEnum.revision,
  ]),
});

export type TCollectionFlowState = z.infer<typeof CollectionFlowStateSchema>;
