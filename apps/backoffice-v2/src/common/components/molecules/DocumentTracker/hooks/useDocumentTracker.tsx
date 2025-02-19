import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { titleCase } from 'string-ts';
import { z } from 'zod';

import { Button } from '@/common/components/atoms/Button/Button';
import { Input } from '@/common/components/atoms/Input/Input';
import { Label } from '@/common/components/atoms/Label/Label';
import { Dialog } from '@/common/components/organisms/Dialog/Dialog';
import { DialogContent } from '@/common/components/organisms/Dialog/Dialog.Content';
import { DialogDescription } from '@/common/components/organisms/Dialog/Dialog.Description';
import { DialogFooter } from '@/common/components/organisms/Dialog/Dialog.Footer';
import { DialogHeader } from '@/common/components/organisms/Dialog/Dialog.Header';
import { DialogTitle } from '@/common/components/organisms/Dialog/Dialog.Title';
import { DialogTrigger } from '@/common/components/organisms/Dialog/Dialog.Trigger';
import { ctw } from '@/common/utils/ctw/ctw';
import { useRequestDocumentsMutation } from '@/domains/documents/hooks/mutations/useRequestDocumentsMutation';
import { useDocumentsTrackerItemsQuery } from '@/domains/documents/hooks/queries/useDocumentsTrackerItemsQuery';
import { documentsQueryKeys } from '@/domains/documents/hooks/query-keys';
import {
  DocumentTrackerItemSchema,
  TrackedDocument,
} from '@/domains/documents/hooks/schemas/document';
import { DialogClose } from '@radix-ui/react-dialog';
import { documentStatusToIcon, Icon } from '../constants';

type MarkIconProps = {
  found: boolean;
  status: TrackedDocument['status'];
  onMarkChange: (reason?: string) => void;
};

const MarkIcon = ({ found, status, onMarkChange }: MarkIconProps) => {
  const [reasonValue, setReasonValue] = useState('');
  const buttonIcon = found ? Icon.MARKED : documentStatusToIcon[status];

  if (status !== 'unprovided') {
    return (
      <button className="cursor-default" type="button">
        {buttonIcon}
      </button>
    );
  }

  if (found) {
    return (
      <button className="cursor-pointer" type="button" onClick={() => onMarkChange()}>
        {buttonIcon}
      </button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="cursor-pointer" type="button">
          {buttonIcon}
        </button>
      </DialogTrigger>

      <DialogContent className="px-16 py-12 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="mb-4 text-2xl">Request document from the client</DialogTitle>
          <DialogDescription className="text-base text-primary">
            By clicking the &quot;Mark for Request&quot;, the document will be marked as requested.
            <br />
            Once marked, you can use the &quot;Request&quot; button button at the top of the
            documents list to send an email to the customer, asking to upload all of the documents
            you have marked as needed.
          </DialogDescription>
        </DialogHeader>

        <Label htmlFor="reason" className="my-2 font-bold">
          Reason (Optional)
        </Label>
        <Input
          value={reasonValue}
          onChange={e => setReasonValue(e.target.value)}
          id="reason"
          placeholder="Add reason"
        />
        <p>
          Use the reason input to tell the client why they are required to upload this document. The
          reason will be visible to the client on the data collection flow on the document uploader
        </p>

        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={() => onMarkChange(reasonValue)}>Mark for Request</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { CommonWorkflowStates } from '@ballerine/common';

export const useDocumentTracker = ({ workflowId }: { workflowId: string }) => {
  const { data: documentTrackerItems, isLoading: isLoadingDocuments } =
    useDocumentsTrackerItemsQuery({ workflowId });

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

  const onRequestDocuments = () =>
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
    });

  const getSubItems = useCallback(
    (documentTrackerItem: TrackedDocument) => {
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

      const foundIndex = selectedIdsToRequest.findIndex(selectedIdentifiers =>
        compareIdentifiers(selectedIdentifiers, identifiers),
      );
      const found = foundIndex > -1;

      const onMarkChange = (reason?: string) => {
        if (found) {
          return setSelectedIdsToRequest(prev => prev.toSpliced(foundIndex, 1));
        }

        if (status !== 'unprovided') {
          return;
        }

        if (reason) {
          identifiers.document.decisionReason = reason;
        }

        return setSelectedIdsToRequest(prev => [...prev, identifiers]);
      };

      return {
        leftIcon: <MarkIcon found={found} status={status} onMarkChange={onMarkChange} />,
        text: titleCase(documentTrackerItem.identifiers.document.category ?? 'N/A'),
        itemClassName: ctw('p-1', {
          'bg-warning/20 rounded-md': found,
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
    isRequestButtonDisabled: !workflow?.nextEvents?.some(event =>
      [CommonWorkflowStates.REVISION, CommonWorkflowStates.MANUAL_REVIEW].includes(event),
    ),
  };
};
