import * as React from 'react';
import { ctw } from '@ballerine/ui';

import { SidebarMenu } from './Sidebar.Menu';
import { SidebarRail } from './Sidebar.Rail';
import { SidebarGroup } from './Sidebar.Group';
import { SidebarInput } from './Sidebar.Input';
import { SidebarInset } from './Sidebar.Inset';
import { useSidebar } from './hooks/useSidebar';
import { SidebarFooter } from './Sidebar.Footer';
import { SidebarHeader } from './Sidebar.Header';
import { SidebarContent } from './Sidebar.Content';
import { SidebarMenuSub } from './Sidebar.MenuSub';
import { SidebarTrigger } from './Sidebar.Trigger';
import { SidebarMenuItem } from './Sidebar.MenuItem';
import { SidebarProvider } from './Sidebar.Provider';
import { SidebarMenuBadge } from './Sidebar.MenuBadge';
import { SidebarSeparator } from './Sidebar.Seperator';
import { SidebarGroupLabel } from './Sidebar.GroupLabel';
import { SidebarMenuAction } from './Sidebar.MenuAction';
import { SidebarMenuButton } from './Sidebar.MenuButton';
import { SidebarGroupAction } from './Sidebar.GroupAction';
import { SidebarMenuSubItem } from './Sidebar.MenuSubItem';
import { SidebarGroupContent } from './Sidebar.GroupContent';
import { SidebarMenuSkeleton } from './Sidebar.MenuSkeleton';
import { Sheet } from '@/common/components/atoms/Sheet/Sheet';
import { SheetContent } from '@/common/components/atoms/Sheet';
import { SidebarMenuSubButton } from './Sidebar.MenuSubButton';

const SIDEBAR_WIDTH_MOBILE = '20rem';

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    side?: 'left' | 'right';
    variant?: 'sidebar' | 'floating' | 'inset';
    collapsible?: 'offcanvas' | 'icon' | 'none';
  }
>(
  (
    {
      side = 'left',
      variant = 'sidebar',
      collapsible = 'offcanvas',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    if (collapsible === 'none') {
      return (
        <div
          className={ctw(
            'bg-sidebar text-sidebar-foreground flex h-full w-[--sidebar-width] flex-col',
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      );
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="bg-sidebar text-sidebar-foreground w-[--sidebar-width] p-0 [&>button]:hidden"
            style={
              {
                '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <div
        ref={ref}
        className="text-sidebar-foreground group peer hidden md:block"
        data-state={state}
        data-collapsible={state === 'collapsed' ? collapsible : ''}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={ctw(
            'h-svh relative w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear',
            'group-data-[collapsible=offcanvas]:w-0',
            'group-data-[side=right]:rotate-180',
            variant === 'floating' || variant === 'inset'
              ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]'
              : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon]',
          )}
        />
        <div
          className={ctw(
            'h-svh fixed inset-y-0 z-10 hidden w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex',
            side === 'left'
              ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
              : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
            // Adjust the padding for floating and inset variants.
            variant === 'floating' || variant === 'inset'
              ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]'
              : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l',
            className,
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow"
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);

Sidebar.displayName = 'Sidebar';

export {
  Sidebar,
  useSidebar,
  SidebarMenu,
  SidebarRail,
  SidebarGroup,
  SidebarInset,
  SidebarInput,
  SidebarFooter,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarProvider,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarSeparator,
  SidebarGroupLabel,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarGroupAction,
  SidebarMenuSubItem,
  SidebarGroupContent,
  SidebarMenuSkeleton,
  SidebarMenuSubButton,
};
