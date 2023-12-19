import React, { FunctionComponent } from 'react';
import { IMultiDocumentsProps } from './interfaces';
import { Case } from '@/pages/Entity/components/Case/Case';

export const MultiDocuments: FunctionComponent<IMultiDocumentsProps> = ({ value }) => {
  const documents = value?.data?.filter(({ imageUrl }) => !!imageUrl);

  return (
    <div className={`m-2 rounded p-1`}>
      <Case.Documents documents={documents} isLoading={value?.isLoading} />
    </div>
  );
};
