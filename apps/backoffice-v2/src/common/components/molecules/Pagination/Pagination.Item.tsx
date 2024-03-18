import * as React from 'react';
import { ComponentProps, forwardRef } from 'react';
import { ctw } from '@/common/utils/ctw/ctw';

export const PaginationItem = forwardRef<HTMLLIElement, ComponentProps<'li'>>(
  ({ className, children, ...props }, ref) => (
    <li ref={ref} className={ctw('', className)} {...props}>
      {children}
    </li>
  ),
);
PaginationItem.displayName = 'PaginationItem';
