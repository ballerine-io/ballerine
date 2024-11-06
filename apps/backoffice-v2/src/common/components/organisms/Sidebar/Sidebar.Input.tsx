import * as React from 'react';
import { ctw, Input } from '@ballerine/ui';

export const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={ctw(
        'focus-visible:ring-sidebar-ring h-8 w-full bg-background shadow-none focus-visible:ring-2',
        className,
      )}
      {...props}
    />
  );
});

SidebarInput.displayName = 'SidebarInput';
