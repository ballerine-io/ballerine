import {
  AccordionCard,
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@ballerine/ui';
import { HelpCircle, SendIcon } from 'lucide-react';
import { FunctionComponent } from 'react';

import { Icon } from './constants';
import { useDocumentTracker } from './hooks/useDocumentTracker';
import { DocumentTrackerItems } from './components/DocumentTrackerItems/DocumentTrackerItems';
import { Dialog } from '@/common/components/organisms/Dialog/Dialog';
import { DialogContent } from '@/common/components/organisms/Dialog/Dialog.Content';
import { DialogDescription } from '@/common/components/organisms/Dialog/Dialog.Description';
import { DialogFooter } from '@/common/components/organisms/Dialog/Dialog.Footer';
import { DialogHeader } from '@/common/components/organisms/Dialog/Dialog.Header';
import { DialogTitle } from '@/common/components/organisms/Dialog/Dialog.Title';
import { DialogTrigger } from '@/common/components/organisms/Dialog/Dialog.Trigger';

export const DocumentTracker: FunctionComponent<{ workflowId: string }> = ({ workflowId }) => {
  const {
    getSubItems,
    selectedIdsToRequest,
    onRequestDocuments,
    open,
    onOpenChange,
    isRequestButtonDisabled,
    documentTrackerItems,
  } = useDocumentTracker({ workflowId });

  return (
    <div className={`max-w-xs`}>
      <AccordionCard className={`h-full`}>
        <AccordionCard.Title
          className={`flex-row items-center justify-between space-x-2`}
          rightChildren={
            selectedIdsToRequest.length > 0 ? (
              <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogTrigger disabled={isRequestButtonDisabled}>
                  <Button
                    className="h-7 bg-warning px-2 text-sm"
                    disabled={isRequestButtonDisabled}
                  >
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
          <DocumentTrackerItems
            documentTrackerItems={documentTrackerItems}
            getSubItems={getSubItems}
          />
        </AccordionCard.Content>
      </AccordionCard>
    </div>
  );
};

DocumentTracker.displayName = 'DocumentTracker';
