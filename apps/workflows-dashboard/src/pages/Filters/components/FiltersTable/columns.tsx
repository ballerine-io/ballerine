import { JSONViewButton } from '@/components/molecules/JSONViewButton';
import { IFilter } from '@/domains/filters';
import { formatDate } from '@/utils/format-date';
import { createColumnHelper } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

const columnHelper = createColumnHelper<IFilter>();

export const filtersTableColumns = [
  columnHelper.accessor('id', {
    cell: info => info.getValue<string>(),
    header: () => 'ID',
  }),
  columnHelper.accessor('name', {
    cell: info => info.getValue<string>(),
    header: () => 'Name',
  }),
  columnHelper.accessor('entity', {
    cell: info => info.getValue<string>(),
    header: () => 'Entity',
  }),
  columnHelper.accessor('query', {
    cell: info => (
      <div className="flex flex-row items-center gap-2">
        <JSONViewButton
          trigger={<Eye className="cursor-pointer" />}
          json={JSON.stringify(info.getValue())}
        />
      </div>
    ),
    header: () => 'Definition',
  }),
  columnHelper.accessor('createdAt', {
    cell: info => formatDate(info.getValue<Date>()),
    header: () => 'Created At',
  }),
];
