import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Label,
} from '@ballerine/ui';

import { Dialog } from '@/common/components/organisms/Dialog/Dialog';
import { DialogContent } from '@/common/components/organisms/Dialog/Dialog.Content';
import { DialogDescription } from '@/common/components/organisms/Dialog/Dialog.Description';
import { DialogFooter } from '@/common/components/organisms/Dialog/Dialog.Footer';
import { DialogHeader } from '@/common/components/organisms/Dialog/Dialog.Header';
import { DialogTitle } from '@/common/components/organisms/Dialog/Dialog.Title';
import { DialogTrigger } from '@/common/components/organisms/Dialog/Dialog.Trigger';
import { DialogClose } from '@radix-ui/react-dialog';
import { FilePlus2, MoreVertical } from 'lucide-react';
import { useCallback } from 'react';
import { useReasonInput } from './hooks/useReasonInput';

export interface ICollectionFlowStepOptionsProps {
  onRequestStepFromClient: (reason: string) => void;
}

export const CollectionFlowStepOptions = ({
  step,
  workflow,
  onRequestStepFromClient,
}: ICollectionFlowStepOptionsProps) => {
  const { reason, setReason, clearReason } = useReasonInput();

  const onReasonSubmit = useCallback(() => {
    onRequestStepFromClient(reason);
    clearReason();
  }, [onRequestStepFromClient, reason, clearReason]);

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="ms-auto text-muted-foreground d-5 focus-visible:visible group-hover:visible aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:bg-background aria-disabled:opacity-50 data-[state=open]:visible"
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
          value={reason}
          onChange={e => setReason(e.target.value)}
          id="reason"
          placeholder="Add reason"
        />
        <p>
          Use the reason input to tell the client why they are required to upload this document. The
          reason will be visible to the client on the data collection flow on the document uploader
        </p>

        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onReasonSubmit}>Mark for Request</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
