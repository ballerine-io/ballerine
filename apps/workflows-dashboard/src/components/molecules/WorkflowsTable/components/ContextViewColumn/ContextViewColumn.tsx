import { Button } from '@/components/atoms/Button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/atoms/Dialog';
import { CodeIcon } from 'lucide-react';
import Scrollbars from 'react-custom-scrollbars';
import ReactJson from 'react-json-view';

interface Props {
  context: string;
}

export const ContextViewColumn = ({ context }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <CodeIcon size="16" />
          View context
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[80vh] min-w-[80%]">
        <div className="pr-4">
          <Scrollbars>
            <ReactJson src={context ? JSON.parse(context) : {}} />
          </Scrollbars>
        </div>
      </DialogContent>
    </Dialog>
  );
};
