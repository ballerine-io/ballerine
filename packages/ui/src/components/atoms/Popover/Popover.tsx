'use client';

import { ctw } from '@/common/utils/ctw';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & { disablePortal?: boolean }
>(({ className, align = 'center', sideOffset = 4, disablePortal = false, ...props }, ref) => {
  const WrapperComponent = disablePortal ? React.Fragment : PopoverPrimitive.Portal;

  return (
    <WrapperComponent>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={ctw(
          'bg-popover text-popover-foreground animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-[100] rounded-md border p-4 shadow-md outline-none',
          className,
        )}
        {...props}
      />
    </WrapperComponent>
  );
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverContent, PopoverTrigger };
