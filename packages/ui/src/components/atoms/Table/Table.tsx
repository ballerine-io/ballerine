import * as React from 'react';
import { ctw } from '@utils/ctw';

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <table ref={ref} className={ctw('caption-bottom w-full text-sm', className)} {...props} />
  ),
);
Table.displayName = 'Table';
