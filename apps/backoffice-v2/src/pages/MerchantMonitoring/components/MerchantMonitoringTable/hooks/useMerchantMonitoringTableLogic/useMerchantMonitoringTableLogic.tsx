import { useCallback } from 'react';
import { IDataTableProps } from '@ballerine/ui';
import { Link, useLocation } from 'react-router-dom';
import { UPDATEABLE_REPORT_STATUSES } from '@ballerine/common';

import { useLocale } from '@/common/hooks/useLocale/useLocale';
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
    return UPDATEABLE_REPORT_STATUSES.includes(cell.row.original.status) ? (
      <Link to={`/${locale}/merchant-monitoring/${cell.row.id}`} onClick={onClick}>
        {children}
      </Link>
    ) : (
      <div className={`d-full flex p-1 opacity-50`}>{children}</div>
    );
  };

  return { Cell };
};
