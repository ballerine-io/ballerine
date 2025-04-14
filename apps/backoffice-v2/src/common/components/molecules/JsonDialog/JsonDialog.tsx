import { Suspense, lazy } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '../Dialog/Dialog';
import { Loader2 } from 'lucide-react';
import { ctw } from '../../../utils/ctw/ctw';
import { Button } from '../../atoms/Button/Button';

const ReactJson = lazy(() => import('react-json-view'));

export interface JsonDialogProps {
  json: object;
  dialogButtonText?: string;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

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
      <DialogContent className="max-w-4xl">
        <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
          <ReactJson
            name={null}
            theme={'bright'}
            src={json}
            enableClipboard={false}
            displayDataTypes={false}
            displayObjectSize={false}
          />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
};
