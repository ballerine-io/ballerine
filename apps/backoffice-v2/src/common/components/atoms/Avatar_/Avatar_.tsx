import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { ctw } from '@/common/utils/ctw/ctw';

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={ctw('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
    {...props}
  >
    {children}
  </AvatarPrimitive.Root>
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
