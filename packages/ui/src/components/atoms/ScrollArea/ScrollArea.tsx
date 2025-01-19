import { ctw } from '@/common/utils/ctw';
import { ScrollBar } from '@/components/atoms';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as React from 'react';

export const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    orientation: 'vertical' | 'horizontal' | 'both';
  }
>(({ className, children, orientation, ...props }, ref) => (
  <ScrollAreaPrimitive.Root className={ctw('relative overflow-hidden', className)} {...props}>
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]" ref={ref}>
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar orientation="vertical" />
    <ScrollBar orientation="horizontal" />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));

ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
