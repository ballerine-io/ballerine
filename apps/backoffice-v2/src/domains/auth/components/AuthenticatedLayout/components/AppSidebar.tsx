import type { ComponentProps } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from '@/common/components/organisms/Sidebar/Sidebar';
import { NavFooter } from './NavFooter';
import { NavLogo } from './NavLogo';
import { NavMain } from './NavMain';
import { NavIntroduction } from './NavIntroduction';

export const AppSidebar = ({ ...props }: ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar
      collapsible="icon"
      className="bg-[#F4F6FD] px-2 group-data-[collapsible=icon]:px-0"
      {...props}
    >
      <SidebarTrigger className="absolute right-2 top-2 z-10 d-6 group-data-[collapsible=icon]:right-3" />

      <SidebarHeader>
        <NavLogo className="h-24 group-data-[collapsible=icon]:hidden" />
      </SidebarHeader>

      <SidebarContent>
        <NavMain className="group-data-[collapsible=icon]:mt-24 2xl:mt-12 group-data-[collapsible=icon]:2xl:mt-36" />
      </SidebarContent>

      <SidebarFooter>
        <NavIntroduction />

        <NavFooter />
      </SidebarFooter>
    </Sidebar>
  );
};
