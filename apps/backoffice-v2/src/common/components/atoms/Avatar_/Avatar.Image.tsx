import * as React from 'react';
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { ctw } from '@/common/utils/ctw/ctw';

export const AvatarImage = forwardRef<
  ElementRef<typeof AvatarPrimitive.Image>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={ctw('aspect-square h-full w-full', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
