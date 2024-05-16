import { DataTable } from '@/common/components/organisms/DataTable/DataTable';
import { useAlertsTableLogic } from '@/pages/TransactionMonitoringAlerts/components/AlertsTable/hooks/useAlertsTableLogic';
import { IAlertsTableProps } from '@/pages/TransactionMonitoringAlerts/components/AlertsTable/interfaces';
import { FunctionComponent } from 'react';
import { columns } from './columns';

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
