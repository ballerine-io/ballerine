import { DataTable } from '@/common/components/organisms/DataTable/DataTable';
import { useBusinessAlertsTableLogic } from '@/pages/BusinessesAlerts/components/BusinessAlertsTable/hooks/useBusinessAlertsTableLogic/useBusinessAlertsTableLogic';
import { IAlertsTableProps } from '@/pages/TransactionMonitoringAlerts/components/AlertsTable/interfaces';
import { FunctionComponent } from 'react';
import { columns } from './columns';

export const BusinessAlertsTable: FunctionComponent<IAlertsTableProps> = ({ data }) => {
  const { Cell } = useBusinessAlertsTableLogic({ data });

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
