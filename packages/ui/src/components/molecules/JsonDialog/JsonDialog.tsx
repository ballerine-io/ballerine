import { Button } from '@/components/atoms/Button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/atoms/Dialog';
import { ScrollArea } from '@/components/atoms/ScrollArea';
import ReactJson from 'react-json-view';
import { JsonDialogProps } from './interfaces';
import { ctw } from '@/common/utils/ctw';

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
