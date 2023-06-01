import * as React from 'react';
import { ctw } from '../../../utils/ctw/ctw';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={ctw('text-sm text-muted-foreground', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';
