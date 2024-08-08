import { FunctionComponent } from 'react';
import { LucideProps, Minus } from 'lucide-react';
import { ctw, IconContainer, IIconContainerProps } from '@ballerine/ui';

export interface IMinusCircle extends Omit<LucideProps, 'size'> {
  containerProps?: Omit<IIconContainerProps, 'children'>;
  size?: number;
}

export const MinusCircle: FunctionComponent<IMinusCircle> = ({
  containerProps,
  size = 24,
  ...props
}) => {
  return (
    <IconContainer {...containerProps} size={size}>
      <Minus {...props} size={size * 0.55} className={ctw('stroke-[4px]', props.className)} />
    </IconContainer>
  );
};
