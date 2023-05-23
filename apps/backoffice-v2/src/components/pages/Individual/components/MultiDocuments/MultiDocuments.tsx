import { useParams } from '@tanstack/react-router';
import { useEndUserWithWorkflowQuery } from '../../../../../lib/react-query/queries/useEndUserWithWorkflowQuery/useEndUserWithWorkflowQuery';
import { useStorageFilesQuery } from '../../../../../lib/react-query/queries/useStorageFilesQuery/useStorageFilesQuery';
import { Subject } from 'components/organisms/Subject/Subject';
import React, { FunctionComponent } from 'react';
import { IMultiDocumentsProps } from 'components/pages/Individual/components/MultiDocuments/interfaces';

export const MultiDocuments: FunctionComponent<IMultiDocumentsProps> = ({ value }) => {
  const documents = value?.data?.filter(({ imageUrl }) => !!imageUrl);
  const { endUserId } = useParams();
  const { data: endUser } = useEndUserWithWorkflowQuery(endUserId);
  const results = useStorageFilesQuery(
    endUser?.workflow?.workflowContext?.machineContext?.documents?.flatMap(({ pages }) =>
      pages?.map(({ ballerineFileId }) => ballerineFileId),
    ),
  );

  return (
    <div className={`m-2 rounded p-1`}>
      <Subject.Documents
        documents={documents}
        isLoading={results.some(({ isLoading }) => isLoading)}
      />
    </div>
  );
};
