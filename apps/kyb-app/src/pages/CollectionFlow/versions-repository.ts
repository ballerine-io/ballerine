import { FunctionComponent } from 'react';
import { CollectionFlowV1 } from './versions/v1';
import { CollectionFlowV2 } from './versions/v2';

export const versionsRepository: Record<PropertyKey, FunctionComponent<any>> = {
  v1: CollectionFlowV1,
  v2: CollectionFlowV2,
};

export const getCollectionFlowVersion = (version: number) => {
  const versionKey = `v${version}`;

  return versionsRepository[versionKey as keyof typeof versionsRepository];
};
