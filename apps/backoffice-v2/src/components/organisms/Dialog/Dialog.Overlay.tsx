import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ctw } from '../../../utils/ctw/ctw';

export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Overlay
    className={ctw(
      'data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-100',
      className,
    )}
    {...props}
    ref={ref}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
