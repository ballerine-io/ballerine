import type { ComponentProps } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from '@/common/components/organisms/Sidebar/Sidebar';
import { NavFooter } from './NavFooter';
import { NavLogo } from './NavLogo';
import { NavMain } from './NavMain';

export const AppSidebar = ({ ...props }: ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar
      collapsible="icon"
      className="bg-[#F4F6FD] px-2 group-data-[collapsible=icon]:px-0"
      {...props}
    >
      {/* TODO: choose one of the ways to collapse, if needed, either trigger btn or rail component */}
      <SidebarTrigger className="group-data-[collapsible=icon]:h-123 absolute right-2 top-2 z-10" />

      <SidebarHeader>
        <NavLogo className="h-24 group-data-[collapsible=icon]:hidden" />
      </SidebarHeader>

      <SidebarContent>
        <NavMain className="group-data-[collapsible=icon]:mt-24" />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};
