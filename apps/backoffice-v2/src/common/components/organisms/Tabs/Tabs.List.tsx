import { ctw } from '@/common/utils/ctw/ctw';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={ctw(
      'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
      className,
    )}
    {...props}
  />
));

TabsList.displayName = TabsPrimitive.List.displayName;
