import { JSONViewButton } from '@/components/molecules/JSONViewButton';
import { IUIDefinition } from '@/domains/ui-definitions';
import { CloneUIDefinitionButton } from '@/pages/UIDefinitions/components/UIDefinitionsTable/components/CloneUIDefinitionButton';
import { formatDate } from '@/utils/format-date';
import { createColumnHelper } from '@tanstack/react-table';
import { ArrowRightCircleIcon, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const columnHelper = createColumnHelper<IUIDefinition>();

export const uiDefinitionTableColumnns = [
  columnHelper.accessor('id', {
    cell: info => info.getValue<string>(),
    header: () => 'ID',
  }),
  columnHelper.accessor('workflowDefinitionId', {
    cell: info => info.getValue<string>(),
    header: () => 'Workflow Definition ID',
  }),
  columnHelper.accessor('uiContext', {
    cell: info => info.getValue<string>(),
    header: () => 'UI Context',
  }),
  columnHelper.accessor('definition', {
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
  columnHelper.accessor('uiSchema', {
    cell: info => (
      <div className="flex flex-row items-center gap-2">
        <JSONViewButton
          trigger={<Eye className="cursor-pointer" />}
          json={JSON.stringify(info.getValue())}
        />
      </div>
    ),
    header: () => 'UI Schema',
  }),
  columnHelper.accessor('locales', {
    cell: info => {
      const locales = info.getValue() ? JSON.stringify(info.getValue()) : null;

      return (
        <div className="flex flex-row items-center gap-2">
          {locales ? (
            <JSONViewButton trigger={<Eye className="cursor-pointer" />} json={locales} />
          ) : (
            'N/A'
          )}
        </div>
      );
    },
    header: () => 'Translations',
  }),
  columnHelper.accessor('createdAt', {
    cell: info => formatDate(info.getValue<Date>()),
    header: () => 'Created At',
  }),
  columnHelper.accessor('id', {
    cell: info => <CloneUIDefinitionButton uiDefinitionId={info.getValue()} />,
    header: () => '',
  }),
  columnHelper.accessor('id', {
    cell: info => (
      <Link to={`/ui-definitions/${info.row.original.id}`}>
        <ArrowRightCircleIcon />
      </Link>
    ),
    header: () => '',
  }),
];
