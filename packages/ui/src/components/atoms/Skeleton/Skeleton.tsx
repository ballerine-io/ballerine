import { ctw } from '@utils/ctw';
import { HTMLAttributes } from 'react';

export const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={ctw('bg-primary/10 animate-pulse rounded-md', className)} {...props} />
);
