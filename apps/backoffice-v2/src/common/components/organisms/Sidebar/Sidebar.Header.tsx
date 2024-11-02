import * as React from 'react';
import { ctw } from '@ballerine/ui';

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="header"
        className={ctw('flex flex-col gap-2 p-2', className)}
        {...props}
      />
    );
  },
);

SidebarHeader.displayName = 'SidebarHeader';
