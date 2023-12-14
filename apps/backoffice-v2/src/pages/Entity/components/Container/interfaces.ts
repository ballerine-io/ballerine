import { ComponentProps } from 'react';
import { cells } from '@/pages/Entity/hooks/useEntity/cells';

export interface IContainerProps {
  id: string;
  value: Array<{
    type: keyof typeof cells;
  }>;
  props?: ComponentProps<'div'>;
}
