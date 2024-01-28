import { ComponentProps, ReactNode } from 'react';

export interface IParagraphProps {
  value: ReactNode | ReactNode[];
  props?: ComponentProps<'p'>;
}
