import { ctw } from '@/common/utils/ctw/ctw';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@ballerine/ui';
import type { FunctionComponent } from 'react';

import { SidebarGroup } from '@/common/components/organisms/Sidebar/Sidebar.Group';
import { SidebarMenu } from '@/common/components/organisms/Sidebar/Sidebar.Menu';
import { SidebarMenuItem } from '@/common/components/organisms/Sidebar/Sidebar.MenuItem';
import { SidebarMenuSub } from '@/common/components/organisms/Sidebar/Sidebar.MenuSub';
import { SidebarMenuSubItem } from '@/common/components/organisms/Sidebar/Sidebar.MenuSubItem';
import { useSidebarItems } from '../hooks/useSidebarItems/useSidebarItems';
import { NavItem } from './NavItem';

export const NavMain: FunctionComponent<{ className?: string }> = ({ className }) => {
  const { navItems, pathname, filterId, checkIsActiveFilterGroup } = useSidebarItems();

  return (
    <SidebarGroup>
      <SidebarMenu className={ctw('gap-2', className)}>
        {navItems.map(navItem => {
          if ('children' in navItem) {
            const isActiveFilterGroup = checkIsActiveFilterGroup(navItem);

            return (
              <Collapsible
                asChild
                defaultOpen={isActiveFilterGroup}
                key={navItem.key}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <NavItem
                      navItem={navItem}
                      className={ctw('p-0', {
                        'bg-background text-primary': isActiveFilterGroup,
                      })}
                      linkClassName="p-3 group-data-[collapsible=icon]:p-0"
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="pt-2">
                      {navItem.children.map(subItem => (
                        <SidebarMenuSubItem key={subItem.key}>
                          <NavItem
                            navItem={subItem}
                            className={ctw({
                              'font-semibold text-[#20232E]': subItem.filterId === filterId,
                              'text-[#8990AC] aria-[current=page]:font-normal':
                                subItem.filterId && subItem.filterId !== filterId,
                            })}
                          />
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          return (
            <SidebarMenuItem key={navItem.key}>
              <NavItem
                navItem={navItem}
                className={ctw('p-0', {
                  'bg-background text-primary': navItem.href && pathname.includes(navItem.href),
                })}
                linkClassName="p-3 group-data-[collapsible=icon]:p-0"
              />
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};
