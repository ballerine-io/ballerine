import { DefaultContextSchema } from '@/schemas';

export const getCollectionFlowState = (context: DefaultContextSchema) => {
  return context.collectionFlow?.state;
};
