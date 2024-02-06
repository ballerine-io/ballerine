import { Table, TableCell, TableHeader, TableRow } from '@/common/components/atoms/Table';
import { ScrollArea } from '@/common/components/molecules/ScrollArea/ScrollArea';
import { TableHead } from '@/pages/TransactionMonitoringAlerts/components/AlertsTable/AlertsTable.TableHead';
import {
  TableDataMock,
  tableData,
} from '@/pages/TransactionMonitoringAlerts/components/AlertsTable/table-data.mock';
import { TableBody } from '@ballerine/ui';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper<TableDataMock>();

const definition = [
  columnHelper.accessor('date', {
    cell: info => info.getValue(),
    header: 'Date & Time',
  }),
  columnHelper.accessor('merchant', {
    cell: info => info.getValue(),
    header: 'Merchant',
  }),
  columnHelper.accessor('severity', {
    cell: info => info.getValue(),
    header: 'Severity',
  }),
  columnHelper.accessor('alertDetails', {
    cell: info => info.getValue(),
    header: 'Alert Details',
  }),
  columnHelper.accessor('amountOfTxs', {
    cell: info => info.getValue(),
    header: '# of TXs',
  }),
  columnHelper.accessor('assignee', {
    cell: info => info.getValue(),
    header: 'Assignee',
  }),
  columnHelper.accessor('status', {
    cell: info => info.getValue(),
    header: 'Status',
  }),
];

export const AlertsTable = () => {
  const table = useReactTable({
    columns: definition,
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="relative h-full w-full overflow-auto rounded-md border bg-white shadow">
      <ScrollArea orientation="both" className="h-full">
        <Table>
          <TableHeader className="border-0">
            {table.getHeaderGroups().map(({ id, headers }) => {
              return (
                <TableRow key={id} style={{ border: 'none' }}>
                  {headers.map(header => (
                    <TableHead key={header.id} column={header.column}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              );
            })}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => {
              return (
                <TableRow key={row.id} className="h-[76px] even:bg-[#F4F6FD]">
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

{
  /* <TableHead>Date & Time</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Alert Details</TableHead>
                <TableHead># of TXs</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Status</TableHead> */
}
