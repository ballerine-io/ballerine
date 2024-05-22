import React, { FunctionComponent } from 'react';
import { TBusinessReports } from '@/domains/business-reports/fetchers';
import { DataTable, IDataTableProps } from '@/common/components/organisms/DataTable/DataTable';
import { columns } from '@/pages/MerchantMonitoring/components/MerchantMonitoringTable/columns';

export const MerchantMonitoringTable: FunctionComponent<{
  data: TBusinessReports;
}> = ({ data }) => {
  const Cell: IDataTableProps<typeof data>['CellContentWrapper'] = ({ cell, children }) => {
    return (
      <span
        // to={`/${locale}/profiles/individuals/${itemId}${search}`}
        className={`d-full flex p-4`}
      >
        {children}
      </span>
    );
  };

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
