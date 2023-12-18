import { ComponentProps } from 'react';
import { cells } from '@/lib/blocks/cells';

export interface IContainerProps {
  id: string;
  value: Array<{
    type: keyof typeof cells;
  }>;
  props?: ComponentProps<'div'>;
}
