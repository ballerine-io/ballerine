import { ComponentProps, FunctionComponent } from 'react';
import { Dialog } from '@/common/components/molecules/Dialog/Dialog';

export interface IDialogCellProps {
  type: 'dialog';
  value: ComponentProps<typeof Dialog>;
}

export const DialogCell: FunctionComponent<IDialogCellProps> = ({ value }) => {
  return <Dialog {...value} />;
};
