import React from 'react';
import { ctw } from '@ballerine/ui';

export const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      data-sidebar="menu-item"
      className={ctw('group/menu-item relative', className)}
      {...props}
    />
  ),
);

SidebarMenuItem.displayName = 'SidebarMenuItem';
