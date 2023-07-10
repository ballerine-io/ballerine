import * as React from 'react';
import classnames from 'classnames';

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <table
      ref={ref}
      className={classnames('caption-bottom w-full text-sm', className)}
      {...props}
    />
  ),
);
Table.displayName = 'Table';
