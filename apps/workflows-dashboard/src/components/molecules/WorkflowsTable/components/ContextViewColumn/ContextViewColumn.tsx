import { Button } from '@app/components/atoms/Button';
import { Dialog, DialogContent, DialogTrigger } from '@app/components/atoms/Dialog';
import Scrollbars from 'react-custom-scrollbars';
import ReactJson from 'react-json-view';

interface Props {
  context: string;
}

export const ContextViewColumn = ({ context }: Props) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>View context</Button>
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
