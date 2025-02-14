import React, { FunctionComponent } from 'react';
import { columns } from '@/components/templates/report/components/Ecosystem/components/EcosystemTable/columns';
import { DataTable } from '@/components/organisms/DataTable/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { z } from 'zod';
import { EcosystemRecordSchema } from '@ballerine/common';

export const EcosystemTable: FunctionComponent<{
  data: z.infer<typeof EcosystemRecordSchema>[];
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
