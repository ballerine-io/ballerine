import { FunctionComponent } from 'react';
import { NavItem } from './Header.NavItem';
import { navItems } from '@/App/nav-items';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/molecules/NavigationMenu/NavigationMenu';
import { Link } from '@tanstack/react-router';
import { cva } from 'class-variance-authority';
import { ctw } from '@/utils/ctw/ctw';

const navigationMenuTriggerStyle = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:bg-slate-100 disabled:opacity-50 dark:focus:bg-slate-800 disabled:pointer-events-none bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-100 dark:hover:text-slate-100 data-[state=open]:bg-slate-50 dark:data-[state=open]:bg-slate-800 data-[active]:bg-slate-50 dark:data-[active]:bg-slate-800 h-10 py-2 px-4 group w-max',
);

/**
 * @description A nav element which wraps {@link NavItem} components of the app's routes. Supports nested routes.
 *
 * @see {@link NavItem}
 *
 * @constructor
 */
export const Navbar: FunctionComponent = () => {
  return (
    <NavigationMenu
      orientation={'vertical'}
      className={`h-full w-full justify-start [&>div]:h-full [&>div]:w-full`}
    >
      {navItems.map(({ text, key, children }) => (
        <NavigationMenuList
          className={`h-full w-full flex-col items-start justify-start`}
          key={key}
        >
          {children?.length > 0 ? (
            <>
              <div className={`divider`}></div>
              <NavigationMenuItem className={`mb-2 pl-2 text-sm font-bold text-slate-400`}>
                {text}
              </NavigationMenuItem>
              {children?.map(({ text, href, key }) => (
                <NavigationMenuItem key={key} className={`w-full`}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={href}
                      activeProps={{
                        className: `!bg-primary text-white`,
                        'aria-current': 'page',
                      }}
                      className={ctw(navigationMenuTriggerStyle(), `w-full justify-start`)}
                      // Intentionally set to undefined explicitly.
                      search={undefined}
                      params={undefined}
                    >
                      {text}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </>
          ) : (
            <NavigationMenuItem key={key}>
              <NavigationMenuLink href={''}>{text}</NavigationMenuLink>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      ))}
    </NavigationMenu>
  );
};
