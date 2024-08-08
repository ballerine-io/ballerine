import { FunctionComponent } from 'react';
import { Clock4, LucideProps } from 'lucide-react';
import { ctw, IconContainer, IIconContainerProps } from '@ballerine/ui';

export interface IClockCircle extends Omit<LucideProps, 'size'> {
  containerProps?: Omit<IIconContainerProps, 'children'>;
  size?: number;
}

export const ClockCircle: FunctionComponent<IClockCircle> = ({
  containerProps,
  size = 24,
  ...props
}) => {
  return (
    <IconContainer {...containerProps} size={size}>
      <Clock4 {...props} size={size * 0.65} className={ctw('', props.className)} />
    </IconContainer>
  );
};
