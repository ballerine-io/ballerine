import { useFiltersQuery } from '@/domains/filters/hooks/queries/useFiltersQuery/useFiltersQuery';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useCallback, useMemo } from 'react';
import { Building, Goal, Users } from 'lucide-react';
import { TRoutes, TRouteWithChildren } from '@/Router/types';
import { useLocation } from 'react-router-dom';
import { useCustomerQuery } from '@/domains/customer/hook/queries/useCustomerQuery/useCustomerQuery';

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
  const { data: customer } = useCustomerQuery();

  const navItems = [
    {
      text: 'Businesses',
      icon: <Building size={20} />,
      children: [
        ...(customer?.config?.isMerchantMonitoringEnabled
          ? [
              {
                text: 'Merchant Monitoring',
                href: `/en/merchant-monitoring`,
                key: 'nav-item-merchant-monitoring',
              },
            ]
          : []),
        ...(businessesFilters?.map(({ id, name }) => ({
          filterId: id,
          text: name,
          href: `/en/case-management/entities?filterId=${id}`,
          key: `nav-item-${id}`,
        })) ?? []),
      ],
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
          href: `/en/case-management/entities?filterId=${id}`,
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
