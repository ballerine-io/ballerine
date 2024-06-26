import { ComponentProps } from 'react';
import { Select } from '@/common/components/atoms/Select/Select';

export interface ISelect_Props extends ComponentProps<typeof Select> {
  options: Array<{
    label: string;
    value: string;
  }>;
  placeholder?: string;
}
