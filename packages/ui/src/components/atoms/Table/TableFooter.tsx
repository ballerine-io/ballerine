import React from 'react';
import classnames from 'classnames';

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={classnames('bg-primary text-primary-foreground font-medium', className)}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';
