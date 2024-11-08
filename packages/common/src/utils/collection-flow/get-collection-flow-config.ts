import { DefaultContextSchema } from '@/schemas';

export const getCollectionFlowConfig = (
  context: DefaultContextSchema,
): NonNullable<DefaultContextSchema['collectionFlow']>['config'] | undefined => {
  return context.collectionFlow?.config;
};
