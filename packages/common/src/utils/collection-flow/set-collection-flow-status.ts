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
    console.warn('Collection flow state is not present.');

    return context;
  }

  if (!(status in CollectionFlowStatusesEnum)) {
    console.warn(`Invalid status: ${status}`);

    return context;
  }

  context.collectionFlow.state.status = status;

  return context;
};
