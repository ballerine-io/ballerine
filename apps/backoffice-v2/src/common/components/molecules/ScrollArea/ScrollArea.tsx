import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { ScrollBar } from './Scrollbar';
import { ctw } from '../../../utils/ctw/ctw';

interface Props extends ScrollAreaPrimitive.ScrollAreaProps {
  orientation: 'vertical' | 'horizontal' | 'both';
}

export const ScrollArea = React.forwardRef<
  React.ElementRef<React.FC<Props>>,
  React.ComponentPropsWithoutRef<React.FC<Props>>
>(({ className, children, orientation, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={ctw('relative overflow-hidden', className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar orientation="vertical" />
    <ScrollBar orientation="horizontal" />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
