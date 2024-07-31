import { JSONViewButton } from '@/components/molecules/JSONViewButton';
import { IWorkflowDefinition } from '@/domains/workflow-definitions';
import { CloneWorkflowDefinitionButton } from '@/pages/WorkflowDefinitions/components/molecules/WorkflowDefinitionsTable/components/CloneWorkflowDefinitionButton';
import { valueOrNA } from '@/utils/value-or-na';
import { createColumnHelper } from '@tanstack/react-table';
import { ArrowRightCircleIcon, Eye, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

const columnHelper = createColumnHelper<IWorkflowDefinition>();

export const workflowDefinitionsTableColumns = [
  columnHelper.accessor('id', {
    cell: info => info.getValue<string>(),
    header: () => 'ID',
  }),
  columnHelper.accessor('name', {
    cell: info => info.getValue<string>(),
    header: () => 'Name',
  }),
  columnHelper.accessor('displayName', {
    cell: info => valueOrNA(info.getValue<string>()),
    header: () => 'Display Name',
  }),
  columnHelper.accessor('definitionType', {
    cell: info => info.getValue<string>(),
    header: () => 'Definition Type',
  }),
  columnHelper.accessor('variant', {
    cell: info => info.getValue<string>(),
    header: () => 'Variant',
  }),
  columnHelper.accessor('definition', {
    cell: info => (
      <div className="flex flex-row items-center gap-2">
        <JSONViewButton
          trigger={<Eye className="cursor-pointer" />}
          json={JSON.stringify(info.getValue())}
        />
        <Link to={`/workflow-definitions/${info.row.original.id}`}>
          <Pencil />
        </Link>
      </div>
    ),
    header: () => 'Definition',
  }),
  columnHelper.accessor('contextSchema', {
    cell: info => (
      <div className="flex flex-row items-center gap-2">
        <JSONViewButton
          trigger={<Eye className="cursor-pointer" />}
          json={JSON.stringify(info.getValue())}
        />
        <Link to={`/workflow-definitions/${info.row.original.id}`}>
          <Pencil />
        </Link>
      </div>
    ),
    header: () => 'Context Schema',
  }),
  columnHelper.accessor('config', {
    cell: info => (
      <div className="flex flex-row items-center gap-2">
        <JSONViewButton
          trigger={<Eye className="cursor-pointer" />}
          json={JSON.stringify(info.getValue())}
        />
        <Link to={`/workflow-definitions/${info.row.original.id}`}>
          <Pencil />
        </Link>
      </div>
    ),
    header: () => 'Config',
  }),
  columnHelper.accessor('version', {
    cell: info => info.getValue<number>(),
    header: () => 'Version',
  }),
  columnHelper.accessor('id', {
    cell: info => <CloneWorkflowDefinitionButton workflowDefinitionId={info.getValue()} />,
    header: () => '',
  }),
  columnHelper.accessor('id', {
    cell: info => (
      <Link to={`/workflow-definitions/${info.row.original.id}`}>
        <ArrowRightCircleIcon />
      </Link>
    ),
    header: () => '',
  }),
];
