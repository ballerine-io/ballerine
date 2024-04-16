import { TRouteWithChildren, TRoutes } from '@/Router/types';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useFiltersQuery } from '@/domains/filters/hooks/queries/useFiltersQuery/useFiltersQuery';
import { Building, Goal, Users } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useNavbarLogic = () => {
  const { data: filters } = useFiltersQuery();
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
      text: 'Businesses',
      icon: <Building size={20} />,
      children: [
        ...(businessesFilters?.map(({ id, name }) => ({
          filterId: id,
          text: name,
          href: `/en/case-management/entities?filterId=${id}`,
          key: `nav-item-${id}`,
        })) ?? []),
        {
          text: 'Ongoing Monitoring',
          href: `/en/ongoing-monitoring/alerts`,
          key: 'nav-item-alerts',
        },
      ],

      key: 'nav-item-businesses',
    },
    {
      text: 'Individuals',
      icon: <Users size={20} />,
      children:
        individualsFilters?.map(({ id, name }) => ({
          filterId: id,
          text: name,
          href: `/en/case-management/entities?filterId=${id}`,
          key: `nav-item-${id}`,
        })) ?? [],
      key: 'nav-item-individuals',
    },
    {
      text: 'Transaction Monitoring',
      icon: <Goal size={20} />,
      children: [
        {
          text: 'Alerts',
          href: `/en/transaction-monitoring/alerts`,
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
