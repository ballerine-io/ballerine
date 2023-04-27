import { FunctionComponent } from 'react';
import { NavItem } from './Header.NavItem';
import { navItems } from '../../../App/nav-items';
import { useFiltersQuery } from '../../../lib/react-query/queries/useFiltersQuery/useFiltersQuery';
import { useSearch } from '@tanstack/react-router';

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

  return (
    <nav>
      {navItems.map(({ text, key, children }) => (
        <ul className={`menu menu-compact w-full space-y-2`} key={key}>
          {children?.length > 0 ? (
            <>
              <li className={`menu-title`}>
                <span className={`gap-x-2`}>{text}</span>
              </li>
              {text === 'Case Management'
                ? filters?.map(({ id, kind }) => (
                    <NavItem
                      href={'/$locale/case-management/individuals'}
                      search={{
                        kind,
                        filterId: id,
                      }}
                      key={id}
                      className={`capitalize`}
                      activeProps={{
                        className: kind === search?.kind ? `active` : ``,
                      }}
                    >
                      {kind}
                    </NavItem>
                  ))
                : children?.map(({ text, href, key }) => (
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
