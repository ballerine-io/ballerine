import React from 'react';
import classnames from 'classnames';

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={classnames('[&_tr:last-child]:border-0', className)} {...props} />
));
TableBody.displayName = 'TableBody';
