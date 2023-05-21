import * as React from 'react';
import { forwardRef, HTMLAttributes } from 'react';
import { ctw } from '../../../utils/ctw/ctw';

export const AlertDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={ctw('text-sm [&_p]:leading-relaxed', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';
