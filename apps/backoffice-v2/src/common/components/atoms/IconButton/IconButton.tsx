import { FunctionComponent } from 'react';
import { IIconButtonProps } from './interfaces';
import { PrimaryButton } from '../PrimaryButton/PrimaryButton';
import { ctw } from '../../../utils/ctw/ctw';

export const IconButton: FunctionComponent<IIconButtonProps> = ({
  children,
  className,
  leftIcon,
  rightIcon,
}) => {
  return (
    <PrimaryButton className={ctw(`gap-x-4`, className)}>
      {leftIcon}
      {children}
      {rightIcon}
    </PrimaryButton>
  );
};
