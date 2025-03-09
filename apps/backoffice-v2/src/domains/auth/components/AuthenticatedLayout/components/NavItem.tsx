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

import { SidebarMenuButton } from '@/common/components/organisms/Sidebar/Sidebar';
import { ctw } from '@/common/utils/ctw/ctw';
import { TRouteWithOptionalIcon, TRouteWithoutChildren } from '../types';

const PremiumNavItemHoverCard = ({
  premiumProps,
  navItemTitle,
  navItemText,
  children,
}: {
  premiumProps: NonNullable<TRouteWithoutChildren['premium']>;
  navItemTitle?: string;
  navItemText?: string;
  children: ReactNode;
}) => {
  const { caption, checkList, videoLink } = premiumProps;

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        side="right"
        align="start"
        className="cursor-default space-y-4 font-normal normal-case"
        onPointerDown={e => e.stopPropagation()}
      >
        <div className="relative">
          {videoLink ? (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <Skeleton className="absolute inset-0 size-full" />
              <iframe
                src={videoLink}
                frameBorder="0"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>
          ) : (
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-800 2xl:text-base">
                {navItemText || 'Premium Feature'}
              </h3>
            </div>
          )}

          <CrownIcon className="absolute right-1 top-1 -translate-y-1/3 translate-x-1/3 rounded-full bg-[#584EC5] stroke-primary-foreground p-1.5 d-8" />
        </div>

        {navItemTitle && (
          <p
            className={ctw(
              '2xl:text-md text-sm font-medium text-slate-800',
              'hidden group-data-[collapsible=icon]:block',
            )}
          >
            {navItemTitle}
          </p>
        )}

        <p className="text-xs text-slate-600 2xl:text-sm">{caption}</p>
        <div className="space-y-2">
          {checkList.map(checkListItem => (
            <div
              key={checkListItem}
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

const baseNavItemWrapperClassName = 'flex items-center gap-x-2 w-full cursor-default h-full';
const NavItemWrapper = ({
  navItem,
  children,
  className,
}: {
  navItem: TRouteWithOptionalIcon;
  children: ReactNode;
  className?: string;
}) => {
  let NavItemElement = (
    <div
      className={ctw(
        baseNavItemWrapperClassName,
        { 'cursor-pointer': 'children' in navItem },
        className,
      )}
    >
      {children}
    </div>
  );

  if ('href' in navItem && navItem.href) {
    NavItemElement = (
      <NavLink
        to={navItem.href}
        className={ctw(baseNavItemWrapperClassName, 'cursor-pointer', className)}
      >
        {children}
      </NavLink>
    );
  }

  if (navItem.premium?.href) {
    NavItemElement = (
      <a
        href={navItem.premium.href}
        className={ctw(baseNavItemWrapperClassName, 'cursor-pointer', className)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  if (navItem.premium) {
    return (
      <PremiumNavItemHoverCard
        premiumProps={navItem.premium}
        navItemTitle={navItem.text}
        navItemText={navItem.text}
      >
        {NavItemElement}
      </PremiumNavItemHoverCard>
    );
  }

  return NavItemElement;
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
        'flex h-auto w-full items-center gap-x-2 rounded-md text-sm font-bold capitalize text-slate-400 2xl:text-base',
        'group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:!p-0',
        'duration-50 transition-colors',
        {
          'text-slate-400/60': premium,
          'hover:bg-slate-200 hover:text-primary active:bg-primary-foreground active:text-primary':
            !premium,
          'group-data-[collapsible=icon]:hidden': 'children' in navItem,
        },
        className,
      )}
      tooltip={!premium ? text : undefined}
      {...props}
    >
      <NavItemWrapper
        navItem={navItem}
        className={ctw('group-data-[collapsible=icon]:!px-2', linkClassName)}
      >
        {'icon' in navItem && navItem.icon && (
          <navItem.icon className="shrink-0 d-5 group-data-[collapsible=icon]:-ml-0.5" />
        )}
        {text}
        {'children' in navItem && (
          <ChevronRightIcon className="ml-auto transition-transform duration-200 d-4 group-data-[state=open]/collapsible:rotate-90" />
        )}

        {premium && <CrownIcon className="ml-auto stroke-[#968FDE] d-4 2xl:d-5" />}
      </NavItemWrapper>
    </SidebarMenuButton>
  );
});
NavItem.displayName = 'NavItem';

export { NavItem };
