import React from 'react';
import { ctw } from '@/common/utils/ctw';

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={ctw('bg-primary text-primary-foreground font-medium', className)}
    {...props}
  />
));

TableFooter.displayName = 'TableFooter';
