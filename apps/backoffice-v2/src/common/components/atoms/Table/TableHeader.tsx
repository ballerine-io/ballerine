import React from 'react';
import { ctw } from '../../../utils/ctw/ctw';

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={ctw('[&_tr]:border-b', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';
