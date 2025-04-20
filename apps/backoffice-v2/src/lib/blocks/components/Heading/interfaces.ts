import { ComponentProps, ReactNode } from 'react';

export interface IHeadingProps {
  id?: string;
  value: ReactNode;
  props?: ComponentProps<'h2'>;
}
