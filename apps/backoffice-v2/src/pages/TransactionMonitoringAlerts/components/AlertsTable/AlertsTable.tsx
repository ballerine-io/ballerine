import React, { FunctionComponent } from 'react';
import { IAlertsTableProps } from '@/pages/TransactionMonitoringAlerts/components/AlertsTable/interfaces';
import { columns } from './columns';
import { useAlertsTableLogic } from '@/pages/TransactionMonitoringAlerts/components/AlertsTable/hooks/useAlertsTableLogic';
import { UrlDataTable } from '@/common/components/organisms/UrlDataTable/UrlDataTable';

export const AlertsTable: FunctionComponent<IAlertsTableProps> = ({ data }) => {
  const { Cell } = useAlertsTableLogic({ data });

  return (
    <UrlDataTable
      data={data}
      columns={columns}
      CellContentWrapper={Cell}
      options={{
        enableSorting: true,
        initialState: { sorting: [{ id: 'createdAt', desc: true }] },
      }}
      props={{ scroll: { className: 'h-full' }, cell: { className: '!p-0' } }}
    />
  );
};
