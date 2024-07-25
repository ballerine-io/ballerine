import React, { FunctionComponent } from 'react';
import { TBusinessReports } from '@/domains/business-reports/fetchers';
import { DataTable } from '@/common/components/organisms/DataTable/DataTable';
import { columns } from '@/pages/MerchantMonitoring/components/MerchantMonitoringTable/columns';
import { useMerchantMonitoringTableLogic } from '@/pages/MerchantMonitoring/components/MerchantMonitoringTable/hooks/useMerchantMonitoringTableLogic/useMerchantMonitoringTableLogic';

export const MerchantMonitoringTable: FunctionComponent<{
  data: TBusinessReports['businessReports'];
}> = ({ data }) => {
  const { Cell } = useMerchantMonitoringTableLogic();

  return (
    <DataTable
      data={data}
      columns={columns}
      CellContentWrapper={Cell}
      sortByField={`createdAt`}
      options={{
        enableSorting: true,
      }}
      props={{ scroll: { className: 'h-full' }, cell: { className: '!p-0' } }}
    />
  );
};
