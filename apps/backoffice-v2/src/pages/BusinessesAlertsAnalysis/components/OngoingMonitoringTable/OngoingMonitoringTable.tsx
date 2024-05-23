import React, { FunctionComponent } from 'react';
import { columns } from './columns';

import { TBusinessReport } from '@/domains/business-reports/fetchers';
import { DataTable } from '@/common/components/organisms/DataTable/DataTable';

export const OngoingMonitoringTable: FunctionComponent<{
  businessReports: TBusinessReport[];
}> = ({ businessReports }) => {
  return (
    <DataTable
      data={businessReports}
      columns={columns}
      props={{
        container: {
          className: 'max-w-[411px]',
        },
        scroll: {
          className: 'h-[47vh]',
        },
      }}
      options={{
        enableSorting: false,
      }}
    />
  );
};
