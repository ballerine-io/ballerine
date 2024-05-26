import { useFiltersQuery } from '@/domains/filters/hooks/queries/useFiltersQuery/useFiltersQuery';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useCallback, useMemo } from 'react';
import { Building, Goal, Home, Users } from 'lucide-react';
import { TRoutes, TRouteWithChildren } from '@/Router/types';
import { useLocation } from 'react-router-dom';
import { useLocale } from '@/common/hooks/useLocale/useLocale';

export const useNavbarLogic = () => {
  const { data: filters } = useFiltersQuery();
  const locale = useLocale();
  const filterId = useFilterId();
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
      text: 'Home',
      icon: <Home size={20} />,
      href: `/${locale}/home`,
      key: 'nav-item-Home',
    },
    {
      text: 'Businesses',
      icon: <Building size={20} />,
      children:
        businessesFilters?.map(({ id, name }) => ({
          filterId: id,
          text: name,
          href: `/${locale}/case-management/entities?filterId=${id}`,
          key: `nav-item-${id}`,
        })) ?? [],
      key: 'nav-item-businesses',
    },
    {
      text: 'Individuals',
      icon: <Users size={20} />,
      children: [
        {
          text: 'Profiles',
          href: `/en/profiles/individuals`,
          key: 'nav-item-profile-individuals',
        },
        ...(individualsFilters?.map(({ id, name }) => ({
          filterId: id,
          text: name,
          href: `/${locale}/case-management/entities?filterId=${id}`,
          key: `nav-item-${id}`,
        })) ?? []),
      ],
      key: 'nav-item-individuals',
    },
    {
      text: 'Transaction Monitoring',
      icon: <Goal size={20} />,
      children: [
        {
          text: 'Alerts',
          href: `/${locale}/transaction-monitoring/alerts`,
          key: 'nav-item-alerts',
        },
      ],
      key: 'nav-item-transaction-monitoring',
    },
  ] satisfies TRoutes;
  const { pathname } = useLocation();
  const checkIsActiveFilterGroup = useCallback(
    (navItem: TRouteWithChildren) => {
      return navItem.children?.some(
        childNavItem => childNavItem.filterId === filterId || childNavItem.href === pathname,
      );
    },
    [filterId, pathname],
  );

  return {
    navItems,
    filterId,
    checkIsActiveFilterGroup,
  };
};
