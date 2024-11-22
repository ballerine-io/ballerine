import * as React from 'react';
import { ctw } from '@ballerine/ui';

export const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="group-content"
      className={ctw('w-full text-sm', className)}
      {...props}
    />
  ),
);

SidebarGroupContent.displayName = 'SidebarGroupContent';
