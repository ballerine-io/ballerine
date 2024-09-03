import React, { FunctionComponent } from 'react';
import { TBusinessReports } from '@/domains/business-reports/fetchers';
import { columns } from '@/pages/MerchantMonitoring/components/MerchantMonitoringTable/columns';
import { useMerchantMonitoringTableLogic } from '@/pages/MerchantMonitoring/components/MerchantMonitoringTable/hooks/useMerchantMonitoringTableLogic/useMerchantMonitoringTableLogic';
import { UrlDataTable } from '@/common/components/organisms/UrlDataTable/UrlDataTable';

export const MerchantMonitoringTable: FunctionComponent<{
  data: TBusinessReports['businessReports'];
}> = ({ data }) => {
  const { Cell } = useMerchantMonitoringTableLogic();

  return (
    <UrlDataTable
      data={data}
      columns={columns}
      CellContentWrapper={Cell}
      options={{
        enableSorting: true,
        initialState: {
          sorting: [{ id: 'createdAt', desc: true }],
        },
      }}
      props={{ scroll: { className: 'h-full' }, cell: { className: '!p-0' } }}
    />
  );
};
