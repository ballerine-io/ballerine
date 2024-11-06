import * as React from 'react';
import { ctw } from '@ballerine/ui';

export const SidebarGroup = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="group"
        className={ctw('relative flex w-full min-w-0 flex-col p-2', className)}
        {...props}
      />
    );
  },
);

SidebarGroup.displayName = 'SidebarGroup';
