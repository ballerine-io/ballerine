import * as React from 'react';
import { Separator } from '@/common/components/atoms/Separator/Separator';
import { ctw } from '@ballerine/ui';

export const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={ctw('bg-sidebar-border mx-2 w-auto', className)}
      {...props}
    />
  );
});

SidebarSeparator.displayName = 'SidebarSeparator';
