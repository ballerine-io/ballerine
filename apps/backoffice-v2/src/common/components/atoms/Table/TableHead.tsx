import React from 'react';
import { ctw } from '../../../utils/ctw/ctw';

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => (
  <th
    ref={ref}
    className={ctw(
      'h-12 px-4 text-left align-middle font-inter font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  >
    {children}
  </th>
));

TableHead.displayName = 'TableHead';
