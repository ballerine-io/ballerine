import { ComponentProps } from 'react';

export interface IHeadingProps {
  id?: string;
  value: string;
  props?: ComponentProps<'h2'>;
}
