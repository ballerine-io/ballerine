import React, { FunctionComponent } from 'react';
import { DataTable } from '@/common/components/organisms/DataTable/DataTable';
import { columns } from '@/domains/business-reports/components/EcosystemAndTransactions/components/EcosystemAndTransactionsTable/columns';

export const EcosystemAndTransactionsTable: FunctionComponent<{
  data: Array<{
    matchedName: string;
    relatedNodeType: string;
    relatedNode: string;
    indicators: {
      label: string;
      severity: string;
    };
  }>;
}> = ({ data }) => {
  return (
    <DataTable
      data={data}
      columns={columns}
      options={{
        enableSorting: false,
      }}
      props={{ scroll: { className: 'h-full' }, cell: { className: '!p-0' } }}
    />
  );
};
