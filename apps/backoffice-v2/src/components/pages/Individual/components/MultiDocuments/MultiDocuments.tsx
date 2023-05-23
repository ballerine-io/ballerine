import { Subject } from 'components/organisms/Subject/Subject';
import React, { FunctionComponent } from 'react';
import { IMultiDocumentsProps } from 'components/pages/Individual/components/MultiDocuments/interfaces';

export const MultiDocuments: FunctionComponent<IMultiDocumentsProps> = ({ value }) => {
  const documents = value?.data?.filter(({ imageUrl }) => !!imageUrl);

  return (
    <div className={`m-2 rounded p-1`}>
      <Subject.Documents documents={documents} isLoading={value?.isLoading} />
    </div>
  );
};
