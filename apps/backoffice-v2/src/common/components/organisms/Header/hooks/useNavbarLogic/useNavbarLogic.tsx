import { useFiltersQuery } from '@/domains/filters/hooks/queries/useFiltersQuery/useFiltersQuery';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useCallback, useMemo } from 'react';
import { Building, Goal, Users } from 'lucide-react';
import { TRoutes, TRouteWithChildren } from '@/Router/types';

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
  const checkIsActiveFilterGroup = useCallback(
    (navItem: TRouteWithChildren) => {
      return navItem.children?.some(childNavItem => childNavItem.filterId === filterId);
    },
    [filterId],
  );

  return {
    navItems,
    filterId,
    checkIsActiveFilterGroup,
  };
};
