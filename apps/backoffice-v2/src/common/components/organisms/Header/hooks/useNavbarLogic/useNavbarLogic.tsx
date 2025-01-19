import { Building, Goal, Home, MonitorDot, Users } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { useFiltersQuery } from '@/domains/filters/hooks/queries/useFiltersQuery/useFiltersQuery';
import { MERCHANT_MONITORING_QUERY_PARAMS_KEY } from '@/pages/MerchantMonitoring/constants';
import { TRoutes, TRouteWithChildren } from '@/Router/types';

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
  const { data: customer } = useCustomerQuery();
  const merchantMonitoringParams = sessionStorage.getItem(MERCHANT_MONITORING_QUERY_PARAMS_KEY);

  const navItems = [
    {
      text: 'Home',
      icon: <Home size={20} />,
      href: `/${locale}/home`,
      key: 'nav-item-Home',
    },
    ...(customer?.config?.isMerchantMonitoringEnabled
      ? [
          {
            text: 'Merchant Monitoring',
            icon: <MonitorDot size={20} />,
            href: `/en/merchant-monitoring${merchantMonitoringParams ?? ''}`,
            key: 'nav-item-merchant-monitoring',
          },
        ]
      : []),
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
        // {
        //   text: 'Profiles',
        //   href: `/en/profiles/individuals`,
        //   key: 'nav-item-profile-individuals',
        // },
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
