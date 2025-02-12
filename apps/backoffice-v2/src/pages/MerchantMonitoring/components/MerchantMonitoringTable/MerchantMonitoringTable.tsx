import React, { FunctionComponent } from 'react';
import { TBusinessReports } from '@/domains/business-reports/fetchers';
import { useColumns } from '@/pages/MerchantMonitoring/components/MerchantMonitoringTable/columns';
import { useMerchantMonitoringTableLogic } from '@/pages/MerchantMonitoring/components/MerchantMonitoringTable/hooks/useMerchantMonitoringTableLogic/useMerchantMonitoringTableLogic';
import { UrlDataTable } from '@/common/components/organisms/UrlDataTable/UrlDataTable';

export const MerchantMonitoringTable: FunctionComponent<{
  data: TBusinessReports['data'];
  isDemo: boolean;
}> = ({ data, isDemo }) => {
  const { Cell } = useMerchantMonitoringTableLogic();
  const columns = useColumns({ isDemo });

  return (
    <UrlDataTable
      data={data}
      columns={columns}
      CellContentWrapper={Cell}
      options={{
        enableSorting: false,
        initialState: {
          sorting: [{ id: 'createdAt', desc: true }],
        },
      }}
      props={{ scroll: { className: 'h-full' }, cell: { className: '!p-0' } }}
    />
  );
};
