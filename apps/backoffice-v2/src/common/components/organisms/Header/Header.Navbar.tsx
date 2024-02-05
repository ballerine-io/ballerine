import { FunctionComponent, useCallback, useMemo } from 'react';
import { NavItem } from './Header.NavItem';
import { useFiltersQuery } from '../../../../domains/filters/hooks/queries/useFiltersQuery/useFiltersQuery';
import { ctw } from '../../../utils/ctw/ctw';
import { TRoutes, TRouteWithChildren } from '../../../../Router/types';
import { Building, ChevronDown, Users } from 'lucide-react';
import { useSearchParamsByEntity } from '../../../hooks/useSearchParamsByEntity/useSearchParamsByEntity';
import { useSelectEntityFilterOnMount } from '../../../../domains/entities/hooks/useSelectEntityFilterOnMount/useSelectEntityFilterOnMount';
import { Collapsible } from '@/common/components/molecules/Collapsible/Collapsible';
import { CollapsibleTrigger } from '@/common/components/molecules/Collapsible/Collapsible.Trigger';
import { CollapsibleContent } from '@/common/components/molecules/Collapsible/Collapsible.Content';

export const useNavbarLogic = () => {
  const { data: filters } = useFiltersQuery();
  const [searchParams] = useSearchParamsByEntity();
  const individualsFilters = useMemo(
    () => filters?.filter(({ entity }) => entity === 'individuals'),
    [filters],
  );
  const businessesFilters = useMemo(
    () => filters?.filter(({ entity }) => entity === 'businesses'),
    [filters],
  );
  const navItems = [
    {
      text: 'Businesses',
      icon: <Building />,
      children:
        businessesFilters?.map(({ id, name }) => ({
          filterId: id,
          text: name,
          href: `/en/case-management/entities?filterId=${id}`,
          key: `nav-item-${id}`,
        })) ?? [],
      key: 'nav-item-businesses',
    },
    {
      text: 'Individuals',
      icon: <Users />,
      children:
        individualsFilters?.map(({ id, name }) => ({
          filterId: id,
          text: name,
          href: `/en/case-management/entities?filterId=${id}`,
          key: `nav-item-${id}`,
        })) ?? [],
      key: 'nav-item-individuals',
    },
  ] satisfies TRoutes;
  const checkIsActiveFilterGroup = useCallback(
    (navItem: TRouteWithChildren) => {
      return navItem.children?.some(
        childNavItem => childNavItem.filterId === searchParams?.filterId,
      );
    },
    [searchParams?.filterId],
  );

  useSelectEntityFilterOnMount();

  return {
    navItems,
    filters,
    searchParams,
    checkIsActiveFilterGroup,
  };
};

/**
 * @description A nav element which wraps {@link NavItem} components of the app's routes. Supports nested routes.
 *
 * @see {@link NavItem}
 *
 * @constructor
 */
export const Navbar: FunctionComponent = () => {
  const { navItems, searchParams, checkIsActiveFilterGroup } = useNavbarLogic();

  return (
    <nav className={`space-y-3`}>
      {navItems.map(navItem => {
        const isActiveFilterGroup = checkIsActiveFilterGroup(navItem);

        return (
          <>
            {!!navItem.children?.length && (
              <Collapsible
                key={navItem.key}
                defaultOpen={isActiveFilterGroup}
                className={`space-y-2`}
              >
                <CollapsibleTrigger
                  className={ctw(
                    `flex items-center gap-x-2 rounded-lg px-2 py-1.5 text-sm font-bold [&[data-state=open]>svg]:rotate-180`,
                    {
                      'bg-white': isActiveFilterGroup,
                    },
                  )}
                >
                  <div className={`flex items-center gap-x-2`}>
                    {navItem.icon}
                    {navItem.text}
                  </div>
                  <ChevronDown
                    size={18}
                    className={ctw(`transition-transform duration-200 ease-in-out`)}
                  />
                  <span className="sr-only">Toggle</span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ul className={`w-full space-y-2`}>
                    {navItem.children?.map(childNavItem => (
                      <NavItem
                        href={childNavItem.href}
                        key={childNavItem.key}
                        className={ctw(`gap-x-[10px] px-2 text-xs capitalize active:border`, {
                          'font-bold': childNavItem.filterId === searchParams?.filterId,
                        })}
                      >
                        <span>{childNavItem.icon}</span>
                        {childNavItem.text}
                      </NavItem>
                    ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            )}
            {!navItem.children?.length && (
              <ul className={`w-full space-y-2`} key={navItem.key}>
                <NavItem
                  href={navItem.href}
                  key={navItem.key}
                  className={ctw(
                    `flex items-center gap-x-[10px] px-2 py-1.5 text-sm font-bold capitalize active:border`,
                    {
                      'bg-white': navItem.filterId === searchParams?.filterId,
                    },
                  )}
                >
                  <span>{navItem.icon}</span>
                  {navItem.text}
                </NavItem>
              </ul>
            )}
          </>
        );
      })}
    </nav>
  );
};
