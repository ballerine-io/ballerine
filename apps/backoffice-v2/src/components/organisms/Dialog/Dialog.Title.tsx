import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ctw } from '../../../utils/ctw/ctw';

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={ctw('text-lg font-semibold text-slate-900', 'dark:text-slate-50', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
