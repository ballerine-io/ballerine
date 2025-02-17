import { ctw } from '@ballerine/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { titleCase } from 'string-ts';

import { useRequestDocumentsMutation } from '@/domains/documents/hooks/mutations/useRequestDocumentsMutation';
import { useDocumentsTrackerItemsQuery } from '@/domains/documents/hooks/queries/useDocumentsTrackerItemsQuery';
import { documentsQueryKeys } from '@/domains/documents/hooks/query-keys';
import {
  TrackedDocument,
  DocumentTrackerItemSchema,
} from '@/domains/documents/hooks/schemas/document';
import { documentStatusToIcon, Icon } from '../constants';
import { z } from 'zod';

export const useDocumentTracker = ({ workflowId }: { workflowId: string }) => {
  const { data: documentTrackerItems, isLoading: isLoadingDocuments } =
    useDocumentsTrackerItemsQuery({
      workflowId,
    });

  const [open, onOpenChange] = useState(false);
  const [selectedIdsToRequest, setSelectedIdsToRequest] = useState<
    Array<z.infer<typeof DocumentTrackerItemSchema>['identifiers']>
  >([]);

  const queryClient = useQueryClient();
  const { mutate: requestDocuments } = useRequestDocumentsMutation({
    onSuccess: () => {
      setSelectedIdsToRequest([]);
      onOpenChange(false);
      void queryClient.invalidateQueries(documentsQueryKeys.trackerItems({ workflowId }));
    },
  });

  const onRequestDocuments = () =>
    requestDocuments({
      workflowId,
      documents: selectedIdsToRequest.map(identifier => ({
        type: identifier.document.type,
        category: identifier.document.category,
        issuingCountry: identifier.document.issuingCountry,
        issuingVersion: identifier.document.issuingVersion,
        version: identifier.document.version,
        templateId: identifier.document.type,
        entity: {
          id: identifier.entity.id,
          type: identifier.entity.entityType,
        },
      })),
    });

  const getSubItems = useCallback(
    (documentTrackerItem: TrackedDocument) => {
      const { identifiers, status } = documentTrackerItem;
      const compareIdentifiers = (identifiersA: any, identifiersB: any) => {
        return [
          identifiersA.document.type === identifiersB.document.type,
          identifiersA.document.category === identifiersB.document.category,
          identifiersA.document.issuingCountry === identifiersB.document.issuingCountry,
          identifiersA.document.issuingVersion === identifiersB.document.issuingVersion,
          identifiersA.document.version === identifiersB.document.version,
          identifiersA.entity.id === identifiersB.entity.id,
        ].every(Boolean);
      };

      return {
        leftIcon: (
          <button
            className={ctw('cursor-default', status === 'unprovided' && 'cursor-pointer')}
            type="button"
            onClick={() => {
              if (
                selectedIdsToRequest.find(selectedIdentifiers =>
                  compareIdentifiers(selectedIdentifiers, identifiers),
                )
              ) {
                setSelectedIdsToRequest(prev =>
                  prev.filter(
                    selectedIdentifiers => !compareIdentifiers(selectedIdentifiers, identifiers),
                  ),
                );

                return;
              }

              if (status === 'unprovided') {
                setSelectedIdsToRequest(prev => [...prev, identifiers]);
              }
            }}
          >
            {selectedIdsToRequest.find(selectedIdentifiers =>
              compareIdentifiers(selectedIdentifiers, identifiers),
            ) && Icon.MARKED}
            {!selectedIdsToRequest.find(selectedIdentifiers =>
              compareIdentifiers(selectedIdentifiers, identifiers),
            ) && documentStatusToIcon[status]}
          </button>
        ),
        text: titleCase(documentTrackerItem.identifiers.document.category ?? 'N/A'),
        itemClassName: ctw('p-1', {
          'bg-warning/20 rounded-md': selectedIdsToRequest.find(selectedIdentifiers =>
            compareIdentifiers(selectedIdentifiers, identifiers),
          ),
        }),
      };
    },
    [selectedIdsToRequest],
  );

  return {
    documentTrackerItems,
    isLoadingDocuments,
    getSubItems,
    selectedIdsToRequest,
    onRequestDocuments,
    open,
    onOpenChange,
  };
};
