import { Button } from '@/components/atoms/Button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/atoms/Dialog';
import { JSONEditorComponent } from '@/components/organisms/JsonEditor';
import { CodeIcon } from 'lucide-react';
import Scrollbars from 'react-custom-scrollbars';

interface Props {
  json: string;
  trigger?: JSX.Element;
}

export const JSONViewButton = ({
  json,
  trigger = (
    <Button className="flex items-center gap-2">
      <CodeIcon size="16" />
      View context
    </Button>
  ),
}: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="h-[80vh] min-w-[80%]">
        <div className="pr-4">
          <Scrollbars>
            <JSONEditorComponent readOnly value={json ? JSON.parse(json) : {}} />
          </Scrollbars>
        </div>
      </DialogContent>
    </Dialog>
  );
};
