import { PropsWithChildren } from 'react';
import { ButtonComponent } from '../../../types';

export interface IIconButtonProps extends ButtonComponent, PropsWithChildren {
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
}
