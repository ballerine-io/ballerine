import { ctw } from '@ballerine/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { titleCase } from 'string-ts';

import { useRequestDocumentsMutation } from '@/domains/documents/hooks/mutations/useRequestDocumentsMutation';
import { useDocumentsTrackerItemsQuery } from '@/domains/documents/hooks/queries/useDocumentsTrackerItemsQuery';
import { documentsQueryKeys } from '@/domains/documents/hooks/query-keys';
import { TrackedDocument } from '@/domains/documents/hooks/schemas/document';
import { documentStatusToIcon, Icon } from '../constants';

export const useDocumentTracker = ({ workflowId }: { workflowId: string }) => {
  const { data: documents, isLoading: isLoadingDocuments } = useDocumentsTrackerItemsQuery({
    workflowId,
  });

  const [open, onOpenChange] = useState(false);
  const [selectedIdsToRequest, setSelectedIdsToRequest] = useState<string[]>([]);

  const queryClient = useQueryClient();
  const { mutate: requestDocuments } = useRequestDocumentsMutation({
    onSuccess: () => {
      setSelectedIdsToRequest([]);
      onOpenChange(false);
      void queryClient.invalidateQueries(documentsQueryKeys.trackerItems({ workflowId }));
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
            type="button"
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
