import { FunctionComponent } from 'react';
import { CollectionFlowV1 } from './v1/CollectionFlowV1';

export const versionsRepository: Record<PropertyKey, FunctionComponent<any>> = {
  v1: CollectionFlowV1,
};

export const getCollectionFlowVersion = (version: number) => {
  const versionKey = `v${version}`;

  return versionsRepository[versionKey as keyof typeof versionsRepository];
};
