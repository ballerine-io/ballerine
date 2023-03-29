import { FunctionComponent } from 'react';
import { NavItem } from './Header.NavItem';
import { navItems } from '@/App/nav-items';

/**
 * @description A nav element which wraps {@link NavItem} components of the app's routes. Supports nested routes.
 *
 * @see {@link NavItem}
 *
 * @constructor
 */
export const Navbar: FunctionComponent = () => {
  return (
    <nav>
      {navItems.map(({ text, key, children }) => (
        <ul className={`menu menu-compact w-full space-y-2`} key={key}>
          {children?.length > 0 ? (
            <>
              <div className={`divider`}></div>
              <li className={`menu-title`}>
                <span className={`gap-x-2`}>{text}</span>
              </li>
              {children?.map(({ text, href, key }) => (
                <NavItem href={href} key={key}>
                  {text}
                </NavItem>
              ))}
            </>
          ) : (
            <NavItem href={''} key={key}>
              {text}
            </NavItem>
          )}
        </ul>
      ))}
    </nav>
  );
};
