import React from 'react';
import { ctw } from '@/common/utils/ctw';

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={ctw(
      'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
      className,
    )}
    {...props}
  />
));

TableRow.displayName = 'TableRow';
