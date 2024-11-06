import { DefaultContextSchema } from '@/schemas';

export type TCollectionFlow = NonNullable<DefaultContextSchema['collectionFlow']>;
export type TCollectionFlowState = TCollectionFlow['state'];
