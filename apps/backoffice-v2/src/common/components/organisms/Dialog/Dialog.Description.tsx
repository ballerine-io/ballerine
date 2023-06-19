import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ctw } from '../../../utils/ctw/ctw';

export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={ctw('text-sm text-slate-500', 'dark:text-slate-400', className)}
    {...props}
  />
));

DialogDescription.displayName = DialogPrimitive.Description.displayName;
