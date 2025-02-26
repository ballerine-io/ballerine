import type { FunctionComponent } from 'react';

import { UrlDataTable } from '@/common/components/organisms/UrlDataTable/UrlDataTable';
import { TBusinessReports } from '@/domains/business-reports/fetchers';
import { useColumns } from '@/pages/MerchantMonitoring/components/MerchantMonitoringTable/columns';
import { useMerchantMonitoringTableLogic } from '@/pages/MerchantMonitoring/components/MerchantMonitoringTable/hooks/useMerchantMonitoringTableLogic/useMerchantMonitoringTableLogic';

export const MerchantMonitoringTable: FunctionComponent<{
  data: TBusinessReports['data'];
  isDemoAccount: boolean;
}> = ({ data, isDemoAccount }) => {
  const { Cell } = useMerchantMonitoringTableLogic();
  const columns = useColumns({ isDemoAccount });

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
