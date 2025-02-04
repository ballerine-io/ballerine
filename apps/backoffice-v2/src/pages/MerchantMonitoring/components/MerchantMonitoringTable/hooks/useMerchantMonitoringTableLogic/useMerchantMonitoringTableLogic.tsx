import { Link, useLocation } from 'react-router-dom';
import type { Cell as ReactTableCellType } from '@tanstack/react-table';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import React, { useCallback } from 'react';
import { TBusinessReports } from '@/domains/business-reports/fetchers';
import { IDataTableProps } from '@ballerine/ui';

export const useMerchantMonitoringTableLogic = () => {
  const { pathname, search } = useLocation();
  const locale = useLocale();
  const onClick = useCallback(() => {
    sessionStorage.setItem(
      'merchant-monitoring:business-report:previous-path',
      `${pathname}${search}`,
    );
  }, [pathname, search]);

  const Cell: IDataTableProps<TBusinessReports>['CellContentWrapper'] = ({
    cell,
    children,
  }: {
    cell: ReactTableCellType<TBusinessReports['data'][number], any>;
    children: React.ReactNode;
  }) => {
    if (cell.row.original.status === 'completed') {
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

  return {
    Cell,
  };
};
