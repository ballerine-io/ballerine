import { FunctionComponent } from 'react';
import { NavItem } from './Header.NavItem';
import { useFiltersQuery } from '../../../../domains/filters/hooks/queries/useFiltersQuery/useFiltersQuery';
import { ctw } from '../../../utils/ctw/ctw';
import { TRoutes } from '../../../../Router/types';
import { CheckSquare } from 'lucide-react';
import { useSearchParamsByEntity } from '../../../hooks/useSearchParamsByEntity/useSearchParamsByEntity';
import { useSelectEntityFilterOnMount } from '../../../../domains/entities/hooks/useSelectEntityFilterOnMount/useSelectEntityFilterOnMount';

/**
 * @description A nav element which wraps {@link NavItem} components of the app's routes. Supports nested routes.
 *
 * @see {@link NavItem}
 *
 * @constructor
 */
export const Navbar: FunctionComponent = () => {
  const { data: filters } = useFiltersQuery();
  const [searchParams] = useSearchParamsByEntity();
  const navItems = [
    // {
    //   text: 'Home',
    //   href: '/',
    //   icon: <Home />,
    //   key: 'nav-item-home',
    // },
  ] satisfies TRoutes;

  useSelectEntityFilterOnMount();

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
            href={`/en/case-management/entities?entity=${entity}&filterId=${id}`}
            key={id}
            className={ctw(`capitalize`, {
              'bg-muted font-bold': id === searchParams?.filterId,
            })}
          >
            <span>
              <CheckSquare className={`d-4`} />
            </span>{' '}
            {name}
          </NavItem>
        ))}
      </ul>
    </nav>
  );
};
