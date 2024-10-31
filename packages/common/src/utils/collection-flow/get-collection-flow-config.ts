import { DefaultContextSchema } from '@/schemas';

export const getCollectionFlowConfig = (context: DefaultContextSchema) => {
  return context.collectionFlow?.config;
};
