import { ComponentProps } from 'react';

export interface IParagraphProps {
  value: ComponentProps<'p'>['children'];
  props?: ComponentProps<'p'>;
}
