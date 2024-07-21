import { Button } from '@/components/atoms/Button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/atoms/Dialog';
import { JSONViewButton } from '@/components/molecules/JSONViewButton';
import { IUIDefinition } from '@/domains/ui-definitions';
import { formatDate } from '@/utils/format-date';
//@ts-ignore
import { Main as CollectionFlowPortable } from '@ballerine/kyb-app';
import { createColumnHelper } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

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
  columnHelper.accessor('workflowDefinition', {
    cell: info => {
      const { config } = info.row.original.workflowDefinition;
      const { uiSchema, definition, workflowDefinitionId } = info.row.original;

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button>View Colltion Flow</Button>
          </DialogTrigger>
          <DialogContent className="min-w-[90vw] h-[100vh]">
            <CollectionFlowPortable
              schema={{
                id: workflowDefinitionId,
                config,
                uiSchema,
                definition,
              }}
              context={{}}
              customer={{
                id: 'customer-1',
                name: 'customer-1',
                displayName: 'Customer 1',
                logoImageUri: 'https://cdn.ballerine.io/images/ballerine_logo.svg',
                faviconImageUri: '',
                country: 'GB',
                language: 'en',
                websiteUrl: null,
                projects: [
                  {
                    id: 'project-1',
                    name: 'Project 1',
                    customerId: 'customer-1',
                  },
                ],
                subscriptions: null,
              }}
            />
          </DialogContent>
        </Dialog>
      );
    },
    header: () => 'Collection flow',
  }),
  columnHelper.accessor('createdAt', {
    cell: info => formatDate(info.getValue<Date>()),
    header: () => 'Created At',
  }),
];
