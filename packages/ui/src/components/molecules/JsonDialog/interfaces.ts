import { Button } from '@/components/atoms';
import { ComponentProps } from 'react';

export interface JsonDialogProps {
  json: string;
  /**
   * The text to display on the button that opens the dialog.
   * @default "View JSON"
   */
  dialogButtonText?: string;
  buttonProps?: ComponentProps<typeof Button>;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
}
