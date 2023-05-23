import { FunctionComponent } from 'react';
import { NavItem } from './Header.NavItem';
import { useFiltersQuery } from '../../../filters/hooks/queries/useFiltersQuery/useFiltersQuery';
import { useSearch } from '@tanstack/react-router';
import { ctw } from '../../../utils/ctw/ctw';
import { TRoutes } from '../../../App/types';
import { CheckSquare } from 'lucide-react';

/**
 * @description A nav element which wraps {@link NavItem} components of the app's routes. Supports nested routes.
 *
 * @see {@link NavItem}
 *
 * @constructor
 */
export const Navbar: FunctionComponent = () => {
  const { data: filters } = useFiltersQuery();
  const search = useSearch({
    strict: false,
  });
  const navItems = [
    // {
    //   text: 'Home',
    //   href: '/',
    //   icon: <Home />,
    //   key: 'nav-item-home',
    // },
  ] satisfies TRoutes;

  return (
    <nav>
      {navItems.map(({ text, key, icon, children }) => (
        <ul className={`menu menu-compact w-full space-y-2`} key={key}>
          {children?.length > 0 ? (
            <>
              <li className={`menu-title`}>
                <span className={`gap-x-2`}>{text}</span>
              </li>
              {children?.map(({ text, href, key }) => (
                <NavItem href={href} key={key}>
                  {icon} {text}
                </NavItem>
              ))}
            </>
          ) : (
            <NavItem href={''} key={key}>
              {icon} {text}
            </NavItem>
          )}
        </ul>
      ))}
      <ul className={`menu menu-compact w-full space-y-2`}>
        {filters?.map(({ id, name, entity }) => (
          <NavItem
            href={'/$locale/case-management/entities'}
            search={{
              entity,
              filterId: id,
              filterName: name,
            }}
            key={id}
            className={ctw(`capitalize`, {
              'bg-muted font-bold': name === search?.name,
            })}
          >
            <CheckSquare /> {name}
          </NavItem>
        ))}
      </ul>
    </nav>
  );
};
