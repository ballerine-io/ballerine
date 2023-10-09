import ReactJson from 'react-json-view';
import { JsonDialogProps } from './interfaces';
import { ctw } from '../../../utils/ctw/ctw';
import { Dialog } from '../../organisms/Dialog/Dialog';
import { DialogTrigger } from '../../organisms/Dialog/Dialog.Trigger';
import { Button } from '../../atoms/Button/Button';
import { DialogContent } from '../../organisms/Dialog/Dialog.Content';
import { ScrollArea } from '../ScrollArea/ScrollArea';

export const JsonDialog = ({
  json,
  dialogButtonText = 'View JSON',
  buttonProps,
  leftIcon,
  rightIcon,
}: JsonDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...buttonProps} className={ctw('flex items-center gap-2', buttonProps?.className)}>
          {leftIcon}
          {dialogButtonText}
          {rightIcon}
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[80%] bg-white">
        <ScrollArea orientation="both" className={`mt-4 h-[80vh]`}>
          <ReactJson src={JSON.parse(json ?? '{}') as object} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
