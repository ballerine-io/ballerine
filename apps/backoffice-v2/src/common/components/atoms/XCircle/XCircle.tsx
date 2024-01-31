import { FunctionComponent } from 'react';
import {
  IconContainer,
  IIconContainerProps,
} from '@/common/components/atoms/IconContainer/IconContainer';
import { LucideProps, X } from 'lucide-react';
import { ctw } from '@ballerine/ui';

export interface IXCircle extends Omit<LucideProps, 'size'> {
  containerProps?: Omit<IIconContainerProps, 'children'>;
  size?: number;
}

export const XCircle: FunctionComponent<IXCircle> = ({ containerProps, size = 24, ...props }) => {
  return (
    <IconContainer {...containerProps} size={size}>
      <X {...props} size={size * 0.55} className={ctw('stroke-[4px]', props.className)} />
    </IconContainer>
  );
};
