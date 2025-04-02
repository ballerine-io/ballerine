import {
  CollectionFlowSchema,
  CollectionFlowStateSchema,
  CollectionFlowStepSchema,
} from '@/schemas/documents/default-context-schema';
import { Static } from '@sinclair/typebox';

export type TCollectionFlow = Static<typeof CollectionFlowSchema>;
export type TCollectionFlowState = Static<typeof CollectionFlowStateSchema>;
export type TCollectionFlowStep = Static<typeof CollectionFlowStepSchema>;
