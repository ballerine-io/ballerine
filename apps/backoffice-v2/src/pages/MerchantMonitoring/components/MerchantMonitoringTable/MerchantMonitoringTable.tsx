import React, { FunctionComponent } from 'react';
import { TBusinessReports } from '@/domains/business-reports/fetchers';
import { DataTable, IDataTableProps } from '@/common/components/organisms/DataTable/DataTable';
import { columns } from '@/pages/MerchantMonitoring/components/MerchantMonitoringTable/columns';
import { Link } from 'react-router-dom';
import { useLocale } from '@/common/hooks/useLocale/useLocale';

export const MerchantMonitoringTable: FunctionComponent<{
  data: TBusinessReports;
}> = ({ data }) => {
  const locale = useLocale();
  const Cell: IDataTableProps<typeof data>['CellContentWrapper'] = ({ cell, children }) => {
    const itemId = cell.id.replace(`_${cell.column.id}`, '');

    return (
      <Link to={`/${locale}/merchant-monitoring/${itemId}`} className={`d-full flex p-4`}>
        {children}
      </Link>
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
