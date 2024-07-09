import React, { FunctionComponent } from 'react';
import { IAlertsTableProps } from '@/pages/TransactionMonitoringAlerts/components/AlertsTable/interfaces';
import { DataTable } from '@/common/components/organisms/DataTable/DataTable';
import { columns } from './columns';
import { useAlertsTableLogic } from '@/pages/TransactionMonitoringAlerts/components/AlertsTable/hooks/useAlertsTableLogic';

export const AlertsTable: FunctionComponent<IAlertsTableProps> = ({ data }) => {
  const { Cell } = useAlertsTableLogic({ data });

  return (
    <DataTable
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
