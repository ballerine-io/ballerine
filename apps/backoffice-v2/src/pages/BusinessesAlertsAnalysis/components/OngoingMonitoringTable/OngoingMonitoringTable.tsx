import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/atoms/Table';
import { ScrollArea } from '@/common/components/molecules/ScrollArea/ScrollArea';
import { TTransactionsList } from '@/domains/transactions/fetchers';
import {
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { FunctionComponent, useState } from 'react';
import { columns } from './columns';

import { Collapsible } from '@/common/components/molecules/Collapsible/Collapsible';
import { CollapsibleContent } from '@/common/components/molecules/Collapsible/Collapsible.Content';
import { ExpandedTransactionDetails } from '@/pages/TransactionMonitoringAlertsAnalysis/components/ExpandedTransactionDetails';

export const OngoingMonitoringTable: FunctionComponent<{
  transactions: TTransactionsList;
}> = ({ transactions }) => {
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    columns,
    data: transactions,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    enableSortingRemoval: false,
    enableSorting: false,
  });

  return (
    <div className="d-full relative max-w-[411px] overflow-auto rounded-md border bg-white shadow">
      <ScrollArea orientation="both" className="h-[47vh]">
        <Table>
          <TableHeader className="border-0">
            {table.getHeaderGroups().map(({ id, headers }) => {
              return (
                <TableRow key={id} className={`border-b-none`}>
                  {headers.map(header => (
                    <TableHead
                      key={header.id}
                      className={`sticky top-0 z-10 h-[34px] bg-white p-0 text-[14px] font-bold text-[#787981]`}
                    >
                      {header.column.id === 'collapsible' && (
                        <span className={'pe-[30px]'}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                      )}
                      {header.column.id !== 'collapsible' && (
                        <button
                          className="flex h-9 flex-row items-center gap-x-2 px-3 text-[#A3A3A3]"
                          onClick={() => header.column.toggleSorting()}
                        >
                          <span>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
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
                <React.Fragment key={row.id}>
                  <TableRow className="h-[76px] border-b-0 even:bg-[#F4F6FD]/50 hover:bg-[#F4F6FD]/90">
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>

                  <Collapsible open={row.getIsExpanded()} asChild>
                    <CollapsibleContent asChild>
                      <TableRow className={`max-h-[228px] border-y-[1px]`}>
                        <TableCell colSpan={10} className={`p-8`}>
                          <ExpandedTransactionDetails transaction={row.original} />
                        </TableCell>
                      </TableRow>
                    </CollapsibleContent>
                  </Collapsible>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};
