import {
  BuildingIcon,
  FileCheck2Icon,
  GavelIcon,
  GoalIcon,
  HomeIcon,
  LayersIcon,
  MonitorDotIcon,
  UserRoundSearchIcon,
  UsersIcon,
} from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { TRoute, TRouteWithChildren } from '@/domains/auth/components/AuthenticatedLayout/types';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { useFiltersQuery } from '@/domains/filters/hooks/queries/useFiltersQuery/useFiltersQuery';

export const useSidebarItems = () => {
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

  const { pathname, search } = useLocation();
  const checkIsActiveFilterGroup = useCallback(
    (navItem: TRouteWithChildren) => {
      return navItem.children?.some(
        childNavItem => childNavItem.filterId === filterId || childNavItem.href === pathname,
      );
    },
    [filterId, pathname],
  );

  const navItems: TRoute[] = customer?.config?.isDemoAccount
    ? [
        {
          text: 'Home',
          icon: HomeIcon,
          href: `/${locale}/home`,
          key: 'nav-item-home',
        },
        {
          text: 'Web Presence',
          icon: MonitorDotIcon,
          href: `/${locale}/merchant-monitoring`,
          key: 'nav-item-web-presence',
        },
        {
          text: 'Full Onboarding (Example)',
          icon: LayersIcon,
          href: `/${locale}/case-management/entities`,
          key: 'nav-item-full-onboarding',
        },
        {
          text: 'KYB & UBOs',
          icon: BuildingIcon,
          premium: {
            caption: 'Verify businesses, activity, and ownership to stay compliant.',
            checkList: [
              'Retrieve company registry data',
              'Validate existence and status',
              'Identify key stakeholders',
            ],
          },
          key: 'nav-item-kyb-ubos',
        },
        {
          text: 'Identity Verification',
          icon: UserRoundSearchIcon,
          premium: {
            caption: 'Authenticate individuals quickly, using highest standards.',
            checkList: [
              'Validate government-issued IDs',
              'Biometric and liveness checks',
              'Global coverage',
            ],
          },
          key: 'nav-item-identity-verification',
        },
        {
          text: 'Sanctions Screening',
          icon: GavelIcon,
          premium: {
            caption: 'Screen entities against global watchlists.',
            checkList: [
              'Real-time sanctions checks',
              'Sanctions, PEPs, & adverse media',
              'Customizable preferences',
            ],
          },
          key: 'nav-item-sanctions-screening',
        },
        {
          text: 'Documents Verification',
          icon: FileCheck2Icon,
          premium: {
            caption: 'Extract data, classify, validate and verify documents.',
            checkList: [
              'All types of documents',
              'Works in every language',
              'Detect faults and fakes',
            ],
          },
          key: 'nav-item-documents-verifications',
        },
      ]
    : [
        {
          text: 'Home',
          icon: HomeIcon,
          href: `/${locale}/home`,
          key: 'nav-item-Home',
        },
        ...(customer?.config?.isMerchantMonitoringEnabled
          ? [
              {
                text: 'Web Presence',
                icon: MonitorDotIcon,
                href: `/${locale}/merchant-monitoring`,
                key: 'nav-item-merchant-monitoring',
              },
            ]
          : []),
        {
          text: 'Businesses',
          icon: BuildingIcon,
          children:
            businessesFilters?.map(({ id, name }) => ({
              filterId: id,
              text: name,
              key: `nav-item-${id}`,
              href: `/${locale}/case-management/entities?filterId=${id}`,
            })) ?? [],
          key: 'nav-item-businesses',
        },
        {
          text: 'Individuals',
          icon: UsersIcon,
          children: [
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
          icon: GoalIcon,
          children: [
            {
              text: 'Alerts',
              href: `/${locale}/transaction-monitoring/alerts`,
              key: 'nav-item-alerts',
            },
          ],
          key: 'nav-item-transaction-monitoring',
        },
      ];

  return {
    navItems,
    filterId,
    pathname,
    search,
    checkIsActiveFilterGroup,
  };
};
