import { Button } from '@/common/components/atoms/Button/Button';
import { Dialog } from '@/common/components/organisms/Dialog/Dialog';
import { DialogContent } from '@/common/components/organisms/Dialog/Dialog.Content';
import { DialogDescription } from '@/common/components/organisms/Dialog/Dialog.Description';
import { DialogFooter } from '@/common/components/organisms/Dialog/Dialog.Footer';
import { DialogHeader } from '@/common/components/organisms/Dialog/Dialog.Header';
import { DialogTitle } from '@/common/components/organisms/Dialog/Dialog.Title';
import { DialogTrigger } from '@/common/components/organisms/Dialog/Dialog.Trigger';
import { SendIcon } from 'lucide-react';
import { useRequestProcessDialog } from './hooks/useRequestProcessDialog';

interface IRequestProcessesProps {
  requestCount: number;
  isLoading: boolean;
  disabled: boolean;
  onConfirm: () => void;
}

export const RequestProcesses = ({
  requestCount,
  isLoading,
  disabled,
  onConfirm,
}: IRequestProcessesProps) => {
  const { isDialogOpen, onOpenChange } = useRequestProcessDialog();

  return (
    <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild onClick={e => e.stopPropagation()}>
        <Button
          className="flex h-7 flex-row flex-nowrap bg-warning px-2 text-sm"
          disabled={isLoading || disabled}
        >
          <SendIcon className="mr-1.5 d-4" />
          <span className="whitespace-nowrap text-xs font-bold">{`Request ${requestCount}`}</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        onPointerDownOutside={e => e.preventDefault()}
        className="px-20 py-12 sm:max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle className="text-4xl">Request Step Resubmission</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          By clicking the button below, an email with a link will be sent to the customer, directing
          them to resubmit the steps you have marked for revision. The case's status will then
          change to "Revisions" until the customer provides the updated information for the
          requested steps.
        </DialogDescription>

        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              onOpenChange(false);

              onConfirm();
            }}
          >
            Send email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
