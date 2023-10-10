import { ComponentProps } from 'react';

export interface IContainerProps {
  id: string;
  value: Array<{
    type: string;
  }>;
  props?: ComponentProps<'div'>;
}
