import React, { FunctionComponent } from 'react';
import { Case } from '../Case/Case';
import { ExtractCellProps } from '@ballerine/blocks';

export const MultiDocuments: FunctionComponent<ExtractCellProps<'multiDocuments'>> = ({
  value,
}) => {
  const documents = value?.data?.filter(({ imageUrl }) => !!imageUrl);

  return (
    <div className={`m-2 rounded p-1`}>
      <Case.Documents documents={documents} isLoading={value?.isLoading} />
    </div>
  );
};
