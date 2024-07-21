import { JSONViewButton } from '@/components/molecules/JSONViewButton';
import { IAlertDefinition } from '@/domains/alert-definitions';
import { formatDate } from '@/utils/format-date';
import { createColumnHelper } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

const columnHelper = createColumnHelper<IAlertDefinition>();

export const alertDefinitionsColumns = [
  columnHelper.accessor('id', {
    cell: info => info.getValue<string>(),
    header: () => 'ID',
  }),
  columnHelper.accessor('name', {
    cell: info => info.getValue<string>(),
    header: () => 'Name',
  }),
  columnHelper.accessor('defaultSeverity', {
    cell: info => info.getValue<string>(),
    header: () => 'Name',
  }),
  columnHelper.accessor('enabled', {
    cell: info => (info.getValue<boolean>() ? 'Yes' : 'No'),
    header: () => 'Enabled',
  }),
  columnHelper.accessor('description', {
    cell: info => (
      <div className="flex flex-row items-center gap-2">
        <JSONViewButton
          trigger={<Eye className="cursor-pointer" />}
          json={JSON.stringify({ description: info.getValue() || {} })}
        />
      </div>
    ),
    header: () => 'Description',
  }),
  columnHelper.accessor('rulesetId', {
    cell: info => info.getValue(),
    header: () => 'Ruleset Id',
  }),
  columnHelper.accessor('ruleId', {
    cell: info => info.getValue(),
    header: () => 'Rule ID',
  }),
  columnHelper.accessor('inlineRule', {
    cell: info => (
      <div className="flex flex-row items-center gap-2">
        <JSONViewButton
          trigger={<Eye className="cursor-pointer" />}
          json={JSON.stringify(info.getValue() || {})}
        />
      </div>
    ),
    header: () => 'Inline Rule',
  }),
  columnHelper.accessor('config', {
    cell: info => (
      <div className="flex flex-row items-center gap-2">
        <JSONViewButton
          trigger={<Eye className="cursor-pointer" />}
          json={JSON.stringify(info.getValue() || {})}
        />
      </div>
    ),
    header: () => 'Config',
  }),
  columnHelper.accessor('tags', {
    cell: info => (
      <div className="flex flex-row items-center gap-2">
        <JSONViewButton
          trigger={<Eye className="cursor-pointer" />}
          json={JSON.stringify(info.getValue() || {})}
        />
      </div>
    ),
    header: () => 'Tags',
  }),
  columnHelper.accessor('additionalInfo', {
    cell: info => (
      <div className="flex flex-row items-center gap-2">
        <JSONViewButton
          trigger={<Eye className="cursor-pointer" />}
          json={JSON.stringify(info.getValue() || {})}
        />
      </div>
    ),
    header: () => 'Additional Info',
  }),
  columnHelper.accessor('createdAt', {
    cell: info => formatDate(info.getValue<Date>()),
    header: () => 'Created At',
  }),
];
