import { AlertProps } from '@pankod/refine-mantine';
import { SVGProps } from 'react';

export interface IWarningAlertProps extends AlertProps {
  iconProps?: SVGProps<SVGSVGElement>;
}
