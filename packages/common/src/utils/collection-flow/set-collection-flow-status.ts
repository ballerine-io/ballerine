import { DefaultContextSchema } from '@/schemas';
import {
  CollectionFlowStatuses,
  CollectionFlowStatusesEnum,
} from './enums/collection-flow-status-enum';

// Mutates the context.
// Sets the status on the collection flow state.
// Returns the context.
export const setCollectionFlowStatus = (
  context: DefaultContextSchema,
  status: CollectionFlowStatuses,
) => {
  if (!context.collectionFlow?.state) {
    throw new Error('Collection flow state is not present.');
  }

  if (!(status in CollectionFlowStatusesEnum)) {
    throw new Error(`Invalid status: ${status}`);
  }

  context.collectionFlow.state.status = status;

  return context;
};
