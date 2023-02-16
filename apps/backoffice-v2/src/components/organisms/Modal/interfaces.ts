import { DialogContentProps } from '@radix-ui/react-dialog';

export interface IModalProps extends DialogContentProps {
  isOpen: boolean;
  onIsOpenChange: (isOpen: boolean) => void;
  title: string;
  hideTitle?: boolean;
}
