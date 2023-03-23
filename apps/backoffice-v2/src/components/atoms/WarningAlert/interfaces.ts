import { SVGProps } from 'react';
import { DivComponent, WithRequired } from '../../../types';

export interface IWarningAlertProps extends WithRequired<DivComponent, 'children'> {
  iconProps?: SVGProps<SVGSVGElement>;
  isOpen: boolean;
}
