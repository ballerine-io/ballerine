import * as React from 'react';

export const SidebarMenuSubItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ ...props }, ref) => <li ref={ref} {...props} />,
);

SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';
