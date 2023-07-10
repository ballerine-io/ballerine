import React from 'react';
import classnames from 'classnames';

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={classnames('[&_tr]:border-b', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';
