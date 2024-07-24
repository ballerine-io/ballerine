import * as React from 'react';
import { ComponentProps, forwardRef } from 'react';
import { ctw } from '@/common/utils/ctw/ctw';

export const PaginationContent = forwardRef<HTMLUListElement, ComponentProps<'ul'>>(
  ({ className, children, ...props }, ref) => (
    <ul ref={ref} className={ctw('flex flex-row items-center gap-1', className)} {...props}>
      {children}
    </ul>
  ),
);

PaginationContent.displayName = 'PaginationContent';
