import * as React from 'react';
import { ctw } from '@ballerine/ui';

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="footer"
        className={ctw('flex flex-col gap-2 p-2', className)}
        {...props}
      />
    );
  },
);

SidebarFooter.displayName = 'SidebarFooter';
