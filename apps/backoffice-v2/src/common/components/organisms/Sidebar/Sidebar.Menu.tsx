import * as React from 'react';
import { ctw } from '@ballerine/ui';

export const SidebarMenu = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-sidebar="menu"
      className={ctw('flex w-full min-w-0 flex-col gap-1', className)}
      {...props}
    />
  ),
);

SidebarMenu.displayName = 'SidebarMenu';
