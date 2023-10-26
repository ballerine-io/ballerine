import { Button } from '@components/atoms/Button';
import { Dialog, DialogContent, DialogTrigger } from '@components/atoms/Dialog';
import { ScrollArea } from '@components/atoms/ScrollArea';
import { CodeIcon } from 'lucide-react';
import ReactJson from 'react-json-view';

interface Props {
  context: string;
}

export const JsonDialog = ({ context }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <CodeIcon size="16" />
          View context
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[80vh] min-w-[80%] bg-white">
        <div className="pr-4">
          <ScrollArea orientation="both">
            <ReactJson src={context ? (JSON.parse(context) as object) : {}} />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
