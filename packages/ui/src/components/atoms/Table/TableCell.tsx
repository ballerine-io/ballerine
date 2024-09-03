import React from 'react';
import { ctw } from '@/common/utils/ctw';

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={ctw('font-inter p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
));

TableCell.displayName = 'TableCell';
