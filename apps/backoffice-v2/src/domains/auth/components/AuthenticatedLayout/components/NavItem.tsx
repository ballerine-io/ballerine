import {
  CollapsibleTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Skeleton,
} from '@ballerine/ui';
import { ChevronRightIcon, CircleCheckIcon, CrownIcon } from 'lucide-react';
import { forwardRef, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

import { SidebarMenuButton } from '@/common/components/organisms/Sidebar/Sidebar.MenuButton';
import { ctw } from '@/common/utils/ctw/ctw';
import { TRouteWithOptionalIcon, TRouteWithoutChildren } from '../types';

const PremiumNavItemHoverCard = ({
  premiumProps,
}: {
  premiumProps: NonNullable<TRouteWithoutChildren['premium']>;
}) => {
  const { caption, checkList, videoLink } = premiumProps;

  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger className="ml-auto mr-1 cursor-default">
        <CrownIcon className="stroke-[#968FDE] d-4 2xl:d-5" />
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        align="start"
        className="cursor-default space-y-4 font-normal normal-case"
        onPointerDown={e => e.stopPropagation()}
      >
        <div className="relative">
          {videoLink ? (
            <video src={videoLink} className="h-36 w-full" />
          ) : (
            <Skeleton className="h-36 w-full" />
          )}

          <CrownIcon className="absolute right-0 top-0 -translate-y-1/3 translate-x-1/3 rounded-full bg-[#584EC5] stroke-primary-foreground p-1.5 d-8" />
        </div>
        <p className="text-xs text-slate-600 2xl:text-sm">{caption}</p>
        <div className="space-y-2">
          {checkList.map((checkListItem, index) => (
            <div
              key={index}
              className="flex items-center gap-x-1 text-xs text-slate-800 2xl:text-sm"
            >
              <CircleCheckIcon className="stroke-slate-500 d-4" />
              {checkListItem}
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const baseNavItemWrapperClassName = 'flex items-center gap-x-2 w-full';
const NavItemWrapper = ({
  navItem,
  children,
  className,
}: {
  navItem: TRouteWithOptionalIcon;
  children: ReactNode;
  className?: string;
}) => {
  if ('href' in navItem && navItem.href) {
    return (
      <NavLink to={navItem.href} className={ctw(baseNavItemWrapperClassName, className)}>
        {children}
      </NavLink>
    );
  }

  if (navItem.premium?.href) {
    return (
      <a
        href={navItem.premium.href}
        className={ctw(baseNavItemWrapperClassName, className)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return <div className={ctw(baseNavItemWrapperClassName, className)}>{children}</div>;
};

const NavItem = forwardRef<
  React.ElementRef<typeof CollapsibleTrigger>,
  React.ComponentPropsWithoutRef<typeof CollapsibleTrigger> & {
    navItem: TRouteWithOptionalIcon;
    linkClassName?: string;
  }
>(({ navItem, className, linkClassName, ...props }, ref) => {
  const { text, premium } = navItem;

  return (
    <SidebarMenuButton
      ref={ref}
      className={ctw(
        'flex h-auto items-center gap-x-2 rounded-md text-sm font-bold capitalize text-slate-400 2xl:text-base',
        'group-data-[collapsible=icon]:h-9',
        'hover:bg-slate-200 hover:text-primary',
        {
          'active:bg-primary-foreground active:text-primary': !premium,
          'group-data-[collapsible=icon]:hidden': 'children' in navItem,
        },
        className,
      )}
      {...props}
    >
      <NavItemWrapper navItem={navItem} className={linkClassName}>
        {'icon' in navItem && navItem.icon && (
          <navItem.icon className="shrink-0 d-5 group-data-[collapsible=icon]:d-4" />
        )}
        {text}
        {'children' in navItem && (
          <ChevronRightIcon className="ml-auto transition-transform duration-200 d-4 group-data-[state=open]/collapsible:rotate-90" />
        )}
      </NavItemWrapper>
      {premium && <PremiumNavItemHoverCard premiumProps={premium} />}
    </SidebarMenuButton>
  );
});
NavItem.displayName = 'NavItem';

export { NavItem };
