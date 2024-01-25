import { LucideProps, Undo2 } from 'lucide-react';
import { FunctionComponent } from 'react';
import { ctw } from '@ballerine/ui';
import {
  IconContainer,
  IIconContainerProps,
} from '@/common/components/atoms/IconContainer/IconContainer';

export interface IRefreshCircle extends Omit<LucideProps, 'size'> {
  containerProps?: Omit<IIconContainerProps, 'children'>;
  size?: number;
}

export const RefreshCircle: FunctionComponent<IRefreshCircle> = ({
  containerProps,
  size = 24,
  ...props
}) => {
  return (
    <IconContainer {...containerProps} size={size}>
      <Undo2 {...props} size={size * 0.55} className={ctw('stroke-[4px]', props.className)} />
    </IconContainer>
  );
};
