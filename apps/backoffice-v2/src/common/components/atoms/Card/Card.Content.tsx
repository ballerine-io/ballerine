import * as React from 'react';
import { ctw } from '../../../utils/ctw/ctw';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={ctw('p-6 pt-0', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';
