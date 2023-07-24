import { CodeIcon } from 'lucide-react';
import ReactJson from 'react-json-view';
import { JsonDialogProps } from './interfaces';
import { Dialog } from '../../organisms/Dialog/Dialog';
import { DialogTrigger } from '../../organisms/Dialog/Dialog.Trigger';
import { Button } from '../../atoms/Button/Button';
import { DialogContent } from '../../organisms/Dialog/Dialog.Content';
import { ScrollArea } from '../ScrollArea/ScrollArea';

export const JsonDialog = ({ json, dialogButtonText = 'View JSON' }: JsonDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <CodeIcon size="16" />
          {dialogButtonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[80vh] min-w-[80%] bg-white">
        <div className="pr-4">
          <ScrollArea orientation="both">
            <ReactJson src={JSON.parse(json ?? '{}') as object} />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
