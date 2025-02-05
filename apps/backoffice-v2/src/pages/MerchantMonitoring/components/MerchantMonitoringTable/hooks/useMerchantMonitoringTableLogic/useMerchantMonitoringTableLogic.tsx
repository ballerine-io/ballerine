import { IDataTableProps } from '@ballerine/ui';
import { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { MERCHANT_REPORT_STATUSES_MAP } from '@/domains/business-reports/constants';
import { TBusinessReports } from '@/domains/business-reports/fetchers';

export const useMerchantMonitoringTableLogic = () => {
  const { pathname, search } = useLocation();
  const locale = useLocale();
  const onClick = useCallback(() => {
    sessionStorage.setItem(
      'merchant-monitoring:business-report:previous-path',
      `${pathname}${search}`,
    );
  }, [pathname, search]);

  const Cell: IDataTableProps<TBusinessReports['data'][number]>['CellContentWrapper'] = ({
    cell,
    children,
  }) => {
    if (cell.row.original.status === MERCHANT_REPORT_STATUSES_MAP.completed) {
      return (
        <Link
          to={`/${locale}/merchant-monitoring/${cell.row.id}`}
          className={`d-full flex p-1`}
          onClick={onClick}
        >
          {children}
        </Link>
      );
    }

    return children;
  };

  return { Cell };
};
