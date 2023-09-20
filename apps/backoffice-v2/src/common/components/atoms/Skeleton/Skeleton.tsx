import { ComponentProps, FunctionComponent } from 'react';
import { ctw } from '../../../utils/ctw/ctw';

export const Skeleton: FunctionComponent<ComponentProps<'div'>> = ({ className, ...props }) => (
  <div className={ctw('animate-pulse rounded-md bg-slate-200', className)} {...props} />
);
