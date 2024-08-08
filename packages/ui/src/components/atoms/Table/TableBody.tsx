import React from 'react';
import { ctw } from '@/common/utils/ctw';

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={ctw('[&_tr:last-child]:border-0', className)} {...props} />
));

TableBody.displayName = 'TableBody';
