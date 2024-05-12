import React, { FunctionComponent, useCallback } from 'react';
import { IAlertsTableProps } from '@/pages/TransactionMonitoringAlerts/components/AlertsTable/interfaces';
import { DataTable, IDataTableProps } from '@/common/components/molecules/DataTable/DataTable';
import { columns } from './columns';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { Link, useLocation } from 'react-router-dom';

export const AlertsTable: FunctionComponent<IAlertsTableProps> = ({ data }) => {
  const locale = useLocale();
  const { pathname, search } = useLocation();

  const onClick = useCallback(() => {
    sessionStorage.setItem(
      'transaction-monitoring:transactions-drawer:previous-path',
      `${pathname}${search}`,
    );
  }, [pathname, search]);

  const Cell: IDataTableProps<typeof data>['CellWrapper'] = ({ cell, children }) => {
    const itemId = cell.id.replace(`_${cell.column.id}`, '');
    const item = data.find(item => item.id === itemId);

    return (
      <Link
        to={`/${locale}/transaction-monitoring/alerts/${itemId}${search}&businessId=${
          item?.merchant?.id ?? ''
        }&counterpartyId=${item?.counterpartyId ?? ''}`}
        onClick={onClick}
        className={`d-full flex p-4`}
      >
        {children}
      </Link>
    );
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      enableSorting
      CellWrapper={Cell}
      props={{ scroll: { className: 'h-full' }, cell: { className: '!p-0' } }}
    />
  );
};
