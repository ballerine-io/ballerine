import {
  DropdownMenu,
  Input,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Label,
  Button,
} from '@ballerine/ui';

import { Upload } from 'lucide-react';
import { FilePlus2 } from 'lucide-react';
import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { Dialog } from '@/common/components/organisms/Dialog/Dialog';
import { DialogContent } from '@/common/components/organisms/Dialog/Dialog.Content';
import { DialogDescription } from '@/common/components/organisms/Dialog/Dialog.Description';
import { DialogFooter } from '@/common/components/organisms/Dialog/Dialog.Footer';
import { DialogHeader } from '@/common/components/organisms/Dialog/Dialog.Header';
import { DialogTitle } from '@/common/components/organisms/Dialog/Dialog.Title';
import { DialogTrigger } from '@/common/components/organisms/Dialog/Dialog.Trigger';
import { DialogClose } from '@radix-ui/react-dialog';

type DocumentTrackerItemOptionsProps = {
  onMarkChange: (reason?: string) => void;
  isDisabled: boolean;
};

export const DocumentTrackerItemOptions = ({
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
