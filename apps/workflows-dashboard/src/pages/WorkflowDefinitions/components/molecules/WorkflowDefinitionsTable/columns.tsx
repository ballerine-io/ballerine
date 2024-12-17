import { CloneWorkflowDefinitionButton } from '@/components/molecules/CloneWorkflowDefinitionButton';
import { JSONViewButton } from '@/components/molecules/JSONViewButton';
import { IWorkflowDefinition } from '@/domains/workflow-definitions';
import { valueOrNA } from '@/utils/value-or-na';
import { createColumnHelper } from '@tanstack/react-table';
import { ArrowRightCircleIcon, Eye, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const columnHelper = createColumnHelper<IWorkflowDefinition>();

export const workflowDefinitionsTableColumns = [
  columnHelper.accessor('id', {
    cell: info => (
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-gray-600">{info.getValue<string>()}</span>
        <button
          onClick={() => {
            navigator.clipboard
              .writeText(info.getValue<string>())
              .then(() => {
                toast.success('ID copied to clipboard');
              })
              .catch(() => {
                toast.error('Failed to copy ID to clipboard');
              });
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
    ),
    header: () => <span className="font-semibold">ID</span>,
  }),
  columnHelper.accessor('name', {
    cell: info => <span className="font-medium text-blue-600">{info.getValue<string>()}</span>,
    header: () => <span className="font-semibold">Name</span>,
  }),
  columnHelper.accessor('displayName', {
    cell: info => <span className="text-gray-700">{valueOrNA(info.getValue<string>())}</span>,
    header: () => <span className="font-semibold">Display Name</span>,
  }),
  columnHelper.accessor('isPublic', {
    cell: info => (
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          info.getValue<boolean>()
            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
      >
        {info.getValue<boolean>() ? 'Public' : 'Private'}
      </span>
    ),
    header: () => <span className="font-semibold">Visibility</span>,
  }),
  columnHelper.accessor('definitionType', {
    cell: info => (
      <span className="rounded bg-violet-50 px-2 py-1 text-sm text-violet-700">
        {info.getValue<string>()}
      </span>
    ),
    header: () => <span className="font-semibold">Definition Type</span>,
  }),
  columnHelper.accessor('variant', {
    cell: info => (
      <span className="rounded bg-amber-50 px-2 py-1 text-sm text-amber-700">
        {info.getValue<string>()}
      </span>
    ),
    header: () => <span className="font-semibold">Variant</span>,
  }),
  columnHelper.accessor('definition', {
    cell: info => (
      <div className="flex flex-row items-center gap-3">
        <JSONViewButton
          trigger={
            <Eye className="h-5 w-5 cursor-pointer text-gray-600 transition-colors hover:text-blue-600" />
          }
          json={JSON.stringify(info.getValue())}
        />
        <Link to={`/workflow-definitions/${info.row.original.id}`}>
          <Pencil className="h-5 w-5 text-gray-600 transition-colors hover:text-blue-600" />
        </Link>
      </div>
    ),
    header: () => <span className="font-semibold">Definition</span>,
  }),
  columnHelper.accessor('contextSchema', {
    cell: info => (
      <div className="flex flex-row items-center gap-3">
        <JSONViewButton
          trigger={
            <Eye className="h-5 w-5 cursor-pointer text-gray-600 transition-colors hover:text-blue-600" />
          }
          json={JSON.stringify(info.getValue())}
        />
        <Link to={`/workflow-definitions/${info.row.original.id}`}>
          <Pencil className="h-5 w-5 text-gray-600 transition-colors hover:text-blue-600" />
        </Link>
      </div>
    ),
    header: () => <span className="font-semibold">Context Schema</span>,
  }),
  columnHelper.accessor('config', {
    cell: info => (
      <div className="flex flex-row items-center gap-3">
        <JSONViewButton
          trigger={
            <Eye className="h-5 w-5 cursor-pointer text-gray-600 transition-colors hover:text-blue-600" />
          }
          json={JSON.stringify(info.getValue())}
        />
        <Link to={`/workflow-definitions/${info.row.original.id}`}>
          <Pencil className="h-5 w-5 text-gray-600 transition-colors hover:text-blue-600" />
        </Link>
      </div>
    ),
    header: () => <span className="font-semibold">Config</span>,
  }),
  columnHelper.accessor('version', {
    cell: info => (
      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
        v{info.getValue<number>()}
      </span>
    ),
    header: () => <span className="font-semibold">Version</span>,
  }),
  columnHelper.accessor('id', {
    cell: info => (
      <div className="flex justify-center">
        <CloneWorkflowDefinitionButton workflowDefinitionId={info.getValue()} />
      </div>
    ),
    header: () => '',
  }),
  columnHelper.accessor('id', {
    cell: info => (
      <Link to={`/workflow-definitions/${info.row.original.id}`} className="flex justify-center">
        <ArrowRightCircleIcon className="h-6 w-6 text-blue-600 transition-colors hover:text-blue-700" />
      </Link>
    ),
    header: () => '',
  }),
];
