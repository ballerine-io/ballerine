import { Button, ctw } from '@ballerine/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { titleCase } from 'string-ts';

import { useRequestDocumentsMutation } from '@/domains/documents/hooks/mutations/useRequestDocumentsMutation/useRequestDocumentsMutation';
import { useDocumentsTrackerItemsQuery } from '@/domains/documents/hooks/queries/useDocumentsTrackerItemsQuery';
import { documentsQueryKeys } from '@/domains/documents/hooks/query-keys';
import { DocumentTrackerItemSchema, TDocumentsTrackerItem } from '@/domains/documents/schemas';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { CommonWorkflowStates } from '@ballerine/common';
import z from 'zod';
import { documentStatusToIcon, Icon } from '../constants';
import { DocumentTrackerItemOptions } from '../components/DocumentTrackerItemOptions/DocumentTrackerItemOptions';
import { X } from 'lucide-react';

export const useDocumentTracker = ({ workflowId }: { workflowId: string }) => {
  const { data: documentTrackerItems } = useDocumentsTrackerItemsQuery({ workflowId });

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
  const { data: workflow } = useCurrentCaseQuery();

  const onRequestDocuments = useCallback(
    () =>
      requestDocuments({
        workflowId,
        documents: selectedIdsToRequest.map(identifier => ({
          type: identifier.document.type,
          category: identifier.document.category,
          issuingCountry: identifier.document.issuingCountry,
          issuingVersion: identifier.document.issuingVersion,
          decisionReason: identifier.document.decisionReason,
          version: identifier.document.version,
          templateId: identifier.document.type,
          entity: {
            id: identifier.entity.id,
            type: identifier.entity.entityType,
          },
        })),
      }),
    [requestDocuments, selectedIdsToRequest, workflowId],
  );

  const getSubItems = useCallback(
    (
      documentTrackerItem:
        | TDocumentsTrackerItem['business'][number]
        | TDocumentsTrackerItem['individuals']['ubos'][number]
        | TDocumentsTrackerItem['individuals']['directors'][number],
    ) => {
      const { identifiers, status } = documentTrackerItem;
      const compareIdentifiers = (
        identifiersA: z.infer<typeof DocumentTrackerItemSchema>['identifiers'],
        identifiersB: z.infer<typeof DocumentTrackerItemSchema>['identifiers'],
      ) => {
        return [
          identifiersA.document.type === identifiersB.document.type,
          identifiersA.document.category === identifiersB.document.category,
          identifiersA.document.issuingCountry === identifiersB.document.issuingCountry,
          identifiersA.document.issuingVersion === identifiersB.document.issuingVersion,
          identifiersA.document.version === identifiersB.document.version,
          identifiersA.entity.id === identifiersB.entity.id,
        ].every(Boolean);
      };

      const selectedIndex = selectedIdsToRequest.findIndex(selectedIdentifiers =>
        compareIdentifiers(selectedIdentifiers, identifiers),
      );
      const isSelected = selectedIndex > -1;

      const onUnmark = () => {
        setSelectedIdsToRequest(prev => prev.toSpliced(selectedIndex, 1));
      };
      const onMarkChange = (reason?: string) => {
        if (status !== 'unprovided') {
          return;
        }

        identifiers.document.decisionReason = reason || 'Document requested';

        return setSelectedIdsToRequest(prev => [...prev, identifiers]);
      };

      return {
        leftIcon: selectedIndex === -1 ? documentStatusToIcon[status] : Icon.MARKED,
        rightIcon: !isSelected ? (
          <DocumentTrackerItemOptions
            isDisabled={status !== 'unprovided'}
            onMarkChange={onMarkChange}
          />
        ) : (
          <Button
            variant="outline"
            size="icon"
            className="invisible ms-auto text-muted-foreground d-5 focus-visible:visible group-hover:visible aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:bg-background aria-disabled:opacity-50 data-[state=open]:visible"
            onClick={onUnmark}
          >
            <X />
          </Button>
        ),
        text: (
          <div className="flex flex-col space-y-0.5">
            {documentTrackerItem.identifiers.entity.entityType !== 'business' && (
              <span className="font-bold text-gray-900">
                {[
                  documentTrackerItem.identifiers.entity.firstName,
                  documentTrackerItem.identifiers.entity.lastName,
                ]
                  .filter(Boolean)
                  .join(' ')}
              </span>
            )}
            <span className="text-sm font-medium text-gray-900">
              {titleCase(documentTrackerItem.identifiers.document.category ?? 'N/A')}
            </span>
            <span className="text-xs text-gray-500">
              {titleCase(documentTrackerItem.identifiers.document.type ?? 'N/A')}
            </span>
          </div>
        ),
        itemClassName: ctw('p-1', {
          'bg-warning/20 rounded-md': isSelected,
        }),
      };
    },
    [selectedIdsToRequest],
  );

  return {
    documentTrackerItems,
    getSubItems,
    selectedIdsToRequest,
    onRequestDocuments,
    open,
    onOpenChange,
    isRequestButtonDisabled: !workflow?.nextEvents?.some(event =>
      [CommonWorkflowStates.REVISION, CommonWorkflowStates.MANUAL_REVIEW].includes(event),
    ),
  };
};
