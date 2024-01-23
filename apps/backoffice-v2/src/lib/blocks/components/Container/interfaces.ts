import { ComponentProps } from 'react';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

export interface IContainerProps {
  id: string;
  value: Array<{
    type: keyof typeof cells;
  }>;
  props?: ComponentProps<'div'>;
}
