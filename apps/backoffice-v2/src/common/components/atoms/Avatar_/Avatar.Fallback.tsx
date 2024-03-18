import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { ctw } from '@/common/utils/ctw/ctw';

export const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, children, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={ctw(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className,
    )}
    {...props}
  >
    {children}
  </AvatarPrimitive.Fallback>
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
