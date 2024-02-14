import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/atoms/Table';
import { ScrollArea } from '@/common/components/molecules/ScrollArea/ScrollArea';
import { ctw } from '@/common/utils/ctw/ctw';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import { columns } from './columns';
import React, { FunctionComponent } from 'react';
import { TTransactionsList } from '@/domains/transactions/fetchers';

export const AlertAnalysisTable: FunctionComponent<{
  transactions: TTransactionsList;
}> = ({ transactions }) => {
  const table = useReactTable({
    columns: columns,
    data: transactions ?? [],
    getCoreRowModel: getCoreRowModel(),
    enableSortingRemoval: false,
    enableSorting: false,
  });

  return (
    <div className="d-full relative overflow-auto rounded-md border bg-white shadow">
      <ScrollArea orientation="both" className="h-[295px]">
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
