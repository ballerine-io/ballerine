import { ctw } from '@ballerine/ui';
import { useCallback, useState } from 'react';
import { titleCase } from 'string-ts';

import { useRequestDocumentsMutation } from '@/domains/documents/hooks/mutations/useRequestDocumentsMutation';
import { useDocumentsTrackerItemsQuery } from '@/domains/documents/hooks/queries/useDocumentsTrackerItemsQuery';
import { TrackedDocument } from '@/domains/documents/hooks/schemas/document';
import { TWorkflowDefinitionById } from '@/domains/workflow-definitions/fetchers';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { documentStatusToIcon, Icon } from '../constants';

export interface IUseDocumentTrackerLogicParams {
  plugins: Array<
    | NonNullable<NonNullable<TWorkflowDefinitionById['extensions']>['apiPlugins']>[number]
    | NonNullable<
        NonNullable<TWorkflowDefinitionById['extensions']>['childWorkflowPlugins']
      >[number]
    | NonNullable<NonNullable<TWorkflowDefinitionById['extensions']>['commonPlugins']>[number]
  >;
  workflow: TWorkflowById;
}

export const useDocumentTracker = ({ plugins, workflow }: IUseDocumentTrackerLogicParams) => {
  const { data: documents, isLoading: isLoadingDocuments } = useDocumentsTrackerItemsQuery({
    workflowId: workflow.id,
  });

  const [open, onOpenChange] = useState(false);
  const [selectedIdsToRequest, setSelectedIdsToRequest] = useState<string[]>([]);

  const { mutate: requestDocuments } = useRequestDocumentsMutation({
    onSuccess: () => {
      setSelectedIdsToRequest([]);
      onOpenChange(false);
    },
  });

  const onRequestDocuments = () => requestDocuments({ documentIds: selectedIdsToRequest });

  const getSubItems = useCallback(
    (doc: TrackedDocument) => {
      const { documentId, status } = doc;

      if (!documentId) {
        return {
          leftIcon: null,
          text: 'Document ID is missing',
          itemClassName: 'p-1',
        };
      }

      return {
        leftIcon: (
          <button
            className={ctw('cursor-default', status === 'unprovided' && 'cursor-pointer')}
            role="button"
            onClick={() => {
              if (selectedIdsToRequest.includes(documentId)) {
                setSelectedIdsToRequest(prev => prev.filter(id => id !== documentId));
              }

              if (status === 'unprovided') {
                setSelectedIdsToRequest(prev => [...prev, documentId]);
              }
            }}
          >
            {selectedIdsToRequest.includes(documentId) ? Icon.MARKED : documentStatusToIcon[status]}
          </button>
        ),
        text: titleCase(doc.properties.category),
        itemClassName: selectedIdsToRequest.includes(documentId)
          ? 'bg-warning/20 rounded-md p-1'
          : 'p-1',
      };
    },
    [selectedIdsToRequest],
  );

  return {
    documents,
    isLoadingDocuments,
    getSubItems,
    selectedIdsToRequest,
    onRequestDocuments,
    open,
    onOpenChange,
  };
};
