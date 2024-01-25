import { FunctionComponent } from 'react';
import { ctw } from '@ballerine/ui';
import { Check, LucideProps } from 'lucide-react';
import {
  IconContainer,
  IIconContainerProps,
} from '@/common/components/atoms/IconContainer/IconContainer';

export interface ICheckCircle extends Omit<LucideProps, 'size'> {
  containerProps?: Omit<IIconContainerProps, 'children'>;
  size?: number;
}

export const CheckCircle: FunctionComponent<ICheckCircle> = ({
  containerProps,
  size = 24,
  ...props
}) => {
  return (
    <IconContainer {...containerProps} size={size}>
      <Check {...props} size={size * 0.55} className={ctw('stroke-[4px]', props.className)} />
    </IconContainer>
  );
};
