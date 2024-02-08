import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/atoms/Table';
import { ScrollArea } from '@/common/components/molecules/ScrollArea/ScrollArea';
import { Badge, TableBody } from '@ballerine/ui';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, UserCircle2 } from 'lucide-react';
import { ctw } from '@/common/utils/ctw/ctw';
import dayjs from 'dayjs';
import React, { ComponentProps, FunctionComponent } from 'react';
import { Checkbox_ } from '@/common/components/atoms/Checkbox_/Checkbox_';
import { AvatarFallback } from '@/common/components/atoms/Avatar_/Avatar.Fallback';
import { Avatar } from '@/common/components/atoms/Avatar_/Avatar_';
import { AvatarImage } from '@/common/components/atoms/Avatar_/Avatar.Image';
import { createInitials } from '@/common/utils/create-initials/create-initials';
import { TAlertsList } from '@/domains/alerts/fetchers';
import { valueOrNA } from '@/common/utils/value-or-na/value-or-na';
import { FunctionComponentWithChildren } from '@/common/types';
import IntrinsicElements = React.JSX.IntrinsicElements;

const severityToClassName = {
  HIGH: 'bg-destructive/20 text-destructive',
  MEDIUM: 'bg-orange-100 text-orange-300',
  LOW: 'bg-success/20 text-success',
  CRITICAL: 'bg-destructive text-background',
  DEFAULT: 'bg-foreground text-background',
} as const satisfies Record<
  'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL' | 'DEFAULT',
  ComponentProps<typeof Badge>['className']
>;

const columnHelper = createColumnHelper<TAlertsList[number]>();
const NotAvailable: FunctionComponentWithChildren<{
  Component?: IntrinsicElements;
}> = ({ children, Component = 'span' }) => {
  return <Component className={'text-slate-400'}>{children}</Component>;
};

const columns = [
  columnHelper.accessor('createdAt', {
    cell: info => {
      const value = info.getValue();

      if (!value) {
        return <span className={'text-slate-400'}>{value}</span>;
      }

      const date = dayjs(value).format('MMM DD, YYYY');
      const time = dayjs(value).format('hh:mm');

      return (
        <div className={`flex flex-col space-y-0.5`}>
          <span className={`font-semibold`}>{date}</span>
          <span className={`text-xs text-[#999999]`}>{time}</span>
        </div>
      );
    },
    header: 'Date & Time',
  }),
  columnHelper.accessor('merchant', {
    cell: info => {
      const value = info.getValue();

      return (
        <span
          className={ctw({
            'text-slate-400': !value,
          })}
        >
          {valueOrNA(value)}
        </span>
      );
    },
    header: 'Merchant',
  }),
  columnHelper.accessor('severity', {
    cell: info => {
      const value = info.getValue();

      return (
        <Badge
          className={ctw(
            severityToClassName[
              (value?.toUpperCase() as keyof typeof severityToClassName) ?? 'DEFAULT'
            ],
            'w-20 py-0.5 font-bold',
          )}
        >
          {valueOrNA(value)}
        </Badge>
      );
    },
    header: 'Severity',
  }),
  columnHelper.accessor('alertDetails', {
    cell: info => {
      const value = info.getValue();

      return (
        <span
          className={ctw({
            'text-slate-400': !value,
          })}
        >
          {valueOrNA(value)}
        </span>
      );
    },
    header: 'Alert Details',
  }),
  columnHelper.accessor('amountOfTxs', {
    cell: info => valueOrNA(info.getValue()),
    header: '# of TXs',
  }),
  columnHelper.accessor('assignee', {
    cell: info => {
      const value = info.getValue();

      return (
        <div className={`flex items-center gap-x-3`}>
          {(value?.toLowerCase() === 'unassigned' || !value) && (
            <UserCircle2 className={'stroke-[#E4E4E7]'} size={22} />
          )}
          {value && value?.toLowerCase() !== 'unassigned' && (
            <Avatar className={`d-[1.375em]`}>
              <AvatarImage />
              <AvatarFallback className={'bg-[#DCE1E8] text-xs'}>
                {createInitials(value)}
              </AvatarFallback>
            </Avatar>
          )}
          <span
            className={ctw({
              'text-slate-400': !value,
            })}
          >
            {valueOrNA(value)}
          </span>
        </div>
      );
    },
    header: 'Assignee',
  }),
  columnHelper.accessor('status', {
    cell: info => <span className={`font-semibold`}>{valueOrNA(info.getValue())}</span>,
    header: 'Status',
  }),
  columnHelper.accessor('decision', {
    cell: info => <strong>{valueOrNA(info.getValue())}</strong>,
    header: 'Decision',
  }),
  columnHelper.display({
    id: 'select',
    cell: info => {
      return <Checkbox_ className={'border-[#E5E7EB]'} />;
    },
    header: () => {
      return <Checkbox_ className={'border-[#E5E7EB]'} />;
    },
  }),
];

export const AlertsTable: FunctionComponent<{
  data: TAlertsList;
}> = ({ data }) => {
  const table = useReactTable({
    columns,
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),
    enableSortingRemoval: false,
  });

  return (
    <div className="d-full relative overflow-auto rounded-md border bg-white shadow">
      <ScrollArea orientation="both" className="h-full">
        <Table>
          <TableHeader className="z-[99999px] border-0 bg-background">
            {table.getHeaderGroups().map(({ id, headers }) => {
              return (
                <TableRow key={id} className={`border-b-none`}>
                  {headers.map(header => (
                    <TableHead
                      key={header.id}
                      className={`sticky top-0 h-[34px] bg-white p-0 text-[14px] font-bold text-[#787981]`}
                    >
                      {header.column.id === 'select' && (
                        <span className={'ps-4'}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                      )}
                      {header.column.id !== 'select' && (
                        <button
                          className="flex h-9 flex-row items-center gap-x-2 px-3 text-[#A3A3A3]"
                          onClick={() => header.column.toggleSorting()}
                        >
                          <span>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          <ChevronDown
                            className={ctw('d-4', {
                              'rotate-180': header.column.getIsSorted() === 'asc',
                            })}
                          />
                        </button>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              );
            })}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => {
              return (
                <TableRow
                  key={row.id}
                  className="h-[76px] border-b-0 even:bg-[#F4F6FD]/50 hover:bg-[#F4F6FD]/90"
                >
                  {row.getVisibleCells().map(cell => {
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};
