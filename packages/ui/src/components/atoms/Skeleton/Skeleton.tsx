import { ComponentProps, FunctionComponent } from 'react';
import { ctw } from '@/common';

export const Skeleton: FunctionComponent<ComponentProps<'div'>> = ({ className, ...props }) => (
  <div className={ctw('animate-pulse rounded-md bg-slate-200', className)} {...props} />
);
