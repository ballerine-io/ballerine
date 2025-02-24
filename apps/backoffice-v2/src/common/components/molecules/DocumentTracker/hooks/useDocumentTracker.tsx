import {
  ctw,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
} from '@ballerine/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { titleCase } from 'string-ts';

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
import { useRequestDocumentsMutation } from '@/domains/documents/hooks/mutations/useRequestDocumentsMutation/useRequestDocumentsMutation';
import { useDocumentsTrackerItemsQuery } from '@/domains/documents/hooks/queries/useDocumentsTrackerItemsQuery';
import { documentsQueryKeys } from '@/domains/documents/hooks/query-keys';
import { DocumentTrackerItemSchema, TDocumentsTrackerItem } from '@/domains/documents/schemas';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { CommonWorkflowStates } from '@ballerine/common';
import { DialogClose } from '@radix-ui/react-dialog';
import z from 'zod';
import { documentStatusToIcon, Icon } from '../constants';
import { FilePlus2, MoreVertical, Upload } from 'lucide-react';

type DocumentTrackerItemOptionsProps = {
  onMarkChange: (reason?: string) => void;
  isDisabled: boolean;
};

const DocumentTrackerItemOptions = ({
  onMarkChange,
  isDisabled,
}: DocumentTrackerItemOptionsProps) => {
  const [reasonValue, setReasonValue] = useState('');

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="invisible ms-auto text-muted-foreground d-5 focus-visible:visible group-hover:visible aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:bg-background aria-disabled:opacity-50 data-[state=open]:visible"
            aria-disabled={isDisabled}
          >
            <MoreVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="px-0">
          <DropdownMenuItem className="w-full px-8 py-1" asChild>
            <DialogTrigger asChild>
              <Button type="button" variant={'ghost'} className="justify-start px-2">
                <FilePlus2 size={16} className="me-2" />
                Request from client
              </Button>
            </DialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem className={`w-full px-8 py-1`} asChild>
            <Button type="button" variant={'ghost'} className="justify-start px-2">
              <Upload size={16} className="me-2" />
              Upload
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
    (documentTrackerItem: TDocumentsTrackerItem['business'][number]) => {
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

      const onMarkChange = (reason?: string) => {
        if (isSelected) {
          return setSelectedIdsToRequest(prev => prev.toSpliced(selectedIndex, 1));
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
        leftIcon: selectedIndex === -1 ? documentStatusToIcon[status] : Icon.MARKED,
        rightIcon: (
          <DocumentTrackerItemOptions
            isDisabled={isSelected || status !== 'unprovided'}
            onMarkChange={onMarkChange}
          />
        ),
        text: (
          <div className="flex flex-col space-y-0.5">
            <div className="text-sm font-medium text-gray-900">
              {titleCase(documentTrackerItem.identifiers.document.category ?? 'N/A')}
            </div>
            <div className="text-xs text-gray-500">
              {titleCase(documentTrackerItem.identifiers.document.type ?? 'N/A')}
            </div>
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
