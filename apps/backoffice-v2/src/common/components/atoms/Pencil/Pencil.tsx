import { FunctionComponent } from 'react';
import { Pencil as PencilIcon, LucideProps } from 'lucide-react';
import { ctw, IconContainer, IIconContainerProps } from '@ballerine/ui';

export interface IPencil extends Omit<LucideProps, 'size'> {
  containerProps?: Omit<IIconContainerProps, 'children'>;
  size?: number;
}

export const Pencil: FunctionComponent<IPencil> = ({ containerProps, size = 24, ...props }) => {
  return (
    <IconContainer {...containerProps} size={size}>
      <PencilIcon
        {...props}
        size={size * 0.55}
        className={ctw('fill-slate-200 stroke-slate-200 stroke-1', props.className)}
      />
    </IconContainer>
  );
};
