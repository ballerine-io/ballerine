import React, { FunctionComponent } from 'react';
import { columns } from '@/components/templates/report/components/EcosystemAndTransactions/components/EcosystemAndTransactionsTable/columns';
import { DataTable } from '@/components/organisms/DataTable/DataTable';
import { ColumnDef } from '@tanstack/react-table';

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
      columns={columns as unknown as Array<ColumnDef<(typeof data)[number], unknown>>}
      options={{
        enableSorting: false,
      }}
      props={{ scroll: { className: 'h-full' }, cell: { className: '!p-0' } }}
      // The table's actions are disabled as of writing.
      select={{
        onSelect: () => {},
        selected: {},
      }}
      sort={{
        sortBy: 'matchedName',
        sortDir: 'asc',
        onSort: () => {},
      }}
    />
  );
};
