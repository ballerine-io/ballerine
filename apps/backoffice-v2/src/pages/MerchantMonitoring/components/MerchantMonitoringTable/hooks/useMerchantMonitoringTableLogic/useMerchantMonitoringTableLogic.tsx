import { Link, useLocation } from 'react-router-dom';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import React, { useCallback } from 'react';
import { IDataTableProps } from '@/common/components/organisms/DataTable/DataTable';
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
  const Cell: IDataTableProps<TBusinessReports>['CellContentWrapper'] = ({ cell, children }) => {
    return (
      <Link
        to={`/${locale}/merchant-monitoring/${cell.row.id}`}
        className={`d-full flex p-4`}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  };

  return {
    Cell,
  };
};
