import { ComponentProps, FunctionComponent } from 'react';
import { Dialog } from '@/common/components/molecules/Dialog/Dialog';

export interface IDialogCellProps {
  type: 'dialog';
  value: ComponentProps<typeof Dialog> & {
    props?: Omit<ComponentProps<typeof Dialog>, 'onOpenChange' | 'trigger' | 'content' | 'close'>;
  };
}

export const DialogCell: FunctionComponent<IDialogCellProps> = ({ value }) => {
  return (
    <Dialog
      {...value?.props}
      onOpenChange={value?.onOpenChange}
      trigger={value?.trigger}
      content={value?.content}
      close={value?.close}
    />
  );
};
