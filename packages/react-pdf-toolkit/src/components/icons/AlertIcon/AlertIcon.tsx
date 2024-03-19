import { Image } from '@/components/atoms/Image';
import { FunctionComponent } from 'react';
import alertGreyedIcon from '../../../assets/alert-greyed-icon.png';
import alertIcon from '../../../assets/alert-icon.png';

export interface IAlertIconProps {
  variant?: 'default' | 'greyed';
}

export const AlertIcon: FunctionComponent<IAlertIconProps> = ({ variant = 'default' }) => (
  <Image width={12} height={12} src={variant === 'greyed' ? alertGreyedIcon : alertIcon} />
);
