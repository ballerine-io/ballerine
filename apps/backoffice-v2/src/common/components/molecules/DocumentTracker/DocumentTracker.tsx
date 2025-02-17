import {
  AccordionCard,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@ballerine/ui';
import { HelpCircle, Loader2, SendIcon } from 'lucide-react';
import { FunctionComponent, memo, useMemo } from 'react';

import { DocumentsTrackerData, TrackedDocument } from '@/domains/documents/hooks/schemas/document';
import { Icon } from './constants';
import { useDocumentTracker } from './hooks/useDocumentTracker';

export const DocumentTracker: FunctionComponent<{ workflowId: string }> = ({ workflowId }) => {
  const {
    documentTrackerItems,
    isLoadingDocuments,
    getSubItems,
    selectedIdsToRequest,
    onRequestDocuments,
    open,
    onOpenChange,
  } = useDocumentTracker({ workflowId });

  return (
    <div className={`max-w-xs`}>
      <AccordionCard>
        <AccordionCard.Title
          className={`flex-row items-center justify-between`}
          rightChildren={
            selectedIdsToRequest.length > 0 ? (
              <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogTrigger>
                  <Button className="h-7 bg-warning px-2 text-sm">
                    <SendIcon className="mr-1.5 d-4" />
                    <span className="whitespace-nowrap">
                      Request{' '}
                      <span className="text-xs font-bold">{selectedIdsToRequest.length}</span>
                    </span>
                  </Button>
                </DialogTrigger>

                <DialogContent
                  onPointerDownOutside={e => e.preventDefault()}
                  className="px-20 py-12 sm:max-w-2xl"
                >
                  <DialogHeader>
                    <DialogTitle className="text-4xl">Ask for all requests</DialogTitle>
                  </DialogHeader>

                  <DialogDescription>
                    By clicking the button below, an email with a link will be sent to the customer,
                    directing them to upload the documents you have marked as requested. The case’s
                    status will then change to “Revisions” until the customer will provide the
                    needed documents and fixes.
                  </DialogDescription>

                  <DialogFooter>
                    <Button type="button" onClick={onRequestDocuments}>
                      Send email
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <HoverCard openDelay={0}>
                <HoverCardTrigger className={`pb-1.5 pt-1`}>
                  <HelpCircle size={18} className={`stroke-slate-400/70`} />
                </HoverCardTrigger>
                <HoverCardContent side={'top'} align={'start'}>
                  <ul className={`flex flex-col space-y-2`}>
                    <li className={`flex items-center gap-x-2`}>
                      {Icon.INDICATOR}
                      Not yet provided
                    </li>
                    <li className={`flex items-center gap-x-2`}>
                      {Icon.CHECK}
                      Provided
                    </li>
                    <li className={`flex items-center gap-x-2`}>
                      {Icon.MARKED}
                      Marked as requested
                    </li>
                    <li className={`flex items-center gap-x-2`}>
                      {Icon.REQUESTED}
                      Requested
                    </li>
                  </ul>
                </HoverCardContent>
              </HoverCard>
            )
          }
        >
          Documents
        </AccordionCard.Title>
        <AccordionCard.Content>
          <AccordionContent
            documentTrackerItems={documentTrackerItems}
            isLoading={isLoadingDocuments}
            getSubItems={getSubItems}
          />
        </AccordionCard.Content>
      </AccordionCard>
    </div>
  );
};

type AccordionContentProps = {
  documentTrackerItems: DocumentsTrackerData | null | undefined;
  isLoading: boolean;
  getSubItems: (
    doc: TrackedDocument,
  ) => Parameters<typeof AccordionCard.Item>[number]['subitems'][number];
};
const AccordionContent = memo(
  ({ documentTrackerItems, isLoading, getSubItems }: AccordionContentProps) => {
    const businessSubitems = useMemo(
      () => documentTrackerItems?.business.map(getSubItems).filter(Boolean) ?? [],
      [documentTrackerItems?.business, getSubItems],
    );
    const individualsSubitems = useMemo(
      () =>
        [
          ...(documentTrackerItems?.individuals.ubos ?? []),
          ...(documentTrackerItems?.individuals.directors ?? []),
        ]
          .map(getSubItems)
          .filter(Boolean),
      [
        documentTrackerItems?.individuals.ubos,
        documentTrackerItems?.individuals.directors,
        getSubItems,
      ],
    );

    if (isLoading) {
      return (
        <div className="flex h-20 animate-spin items-center justify-center">
          <Loader2 className="d-6" />
        </div>
      );
    }

    if (
      !documentTrackerItems ||
      [
        !documentTrackerItems.business.length,
        !documentTrackerItems.individuals.ubos.length,
        !documentTrackerItems.individuals.directors.length,
      ].every(Boolean)
    ) {
      return (
        <div className="flex h-20 items-center justify-center text-sm">No documents available</div>
      );
    }

    return (
      <>
        <AccordionCard.Item
          title="Company documents"
          value="company-documents"
          ulProps={{ className: 'space-y-0' }}
          subitems={businessSubitems}
        />

        <AccordionCard.Item
          title="Individual's documents"
          value="individual-documents"
          subitems={individualsSubitems}
        />
      </>
    );
  },
);
AccordionContent.displayName = 'AccordionContent';
