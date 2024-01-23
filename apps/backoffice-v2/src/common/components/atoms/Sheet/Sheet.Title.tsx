import { ctw } from '@/common/utils/ctw/ctw';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';

export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={ctw('text-lg font-semibold text-foreground', className)}
    {...props}
  />
));

SheetTitle.displayName = SheetPrimitive.Title.displayName;
