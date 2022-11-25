import { ActionIconProps } from '@mantine/core';

export interface IOcrButtonProps extends ActionIconProps {
  onClick: () => void;
  isSubmittable: boolean
}
