import * as React from 'react';
import { ctw } from '../../../utils/ctw/ctw';

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <table ref={ref} className={ctw('w-full caption-bottom text-sm', className)} {...props} />
  ),
);
Table.displayName = 'Table';
