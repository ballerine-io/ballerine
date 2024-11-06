import { DefaultContextSchema } from '@/schemas';

export const getCollectionFlowAdditionalInformation = (context: DefaultContextSchema) => {
  return context.collectionFlow?.additionalInformation;
};
