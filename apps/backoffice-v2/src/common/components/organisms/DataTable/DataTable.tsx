import React, {
  ComponentProps,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Cell,
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  OnChangeFn,
  RowData,
  RowSelectionState,
  SortingState,
  TableOptions,
  useReactTable,
} from '@tanstack/react-table';
import { ScrollArea } from '@/common/components/molecules/ScrollArea/ScrollArea';
import { DefaultCell } from '@/lib/blocks/components/TableCell/DefaultCell';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/atoms/Table';
import { ctw } from '@/common/utils/ctw/ctw';
import { CollapsibleContent as ShadCNCollapsibleContent } from '@/common/components/molecules/Collapsible/Collapsible.Content';
import { Collapsible } from '@/common/components/molecules/Collapsible/Collapsible';
import { useSort } from '@/common/hooks/useSort/useSort';
import { isInstanceOfFunction } from '@/common/utils/is-instance-of-function/is-instance-of-function';
import { checkIsBooleanishRecord } from '@/lib/zod/utils/checkers';
import { useSelect } from '@/common/hooks/useSelect/useSelect';
import { ChevronDown } from 'lucide-react';
import { FunctionComponentWithChildren } from '@/common/types';

export interface IDataTableProps<TData, TValue = any> {
  data: TData[];
  sortByField?: string;
  columns: Array<ColumnDef<TData, TValue>>;
  caption?: ComponentProps<typeof TableCaption>['children'];

  CellContentWrapper?: FunctionComponentWithChildren<{ cell: Cell<TData, TValue> }>;
  CollapsibleContent?: FunctionComponent<{ row: TData }>;

  // Component props
  props?: {
    scroll?: Partial<ComponentProps<typeof ScrollArea>>;
    table?: ComponentProps<typeof Table>;
    header?: ComponentProps<typeof TableHeader>;
    head?: ComponentProps<typeof TableHead>;
    row?: ComponentProps<typeof TableRow>;
    body?: ComponentProps<typeof TableBody>;
    cell?: ComponentProps<typeof TableCell>;
    emptyCell?: ComponentProps<typeof TableCell>;
    caption?: ComponentProps<typeof TableCaption>;
  };

  // react-table options
  options?: Omit<TableOptions<TData>, 'getCoreRowModel' | 'data' | 'columns'>;
}

export const DataTable = <TData extends RowData, TValue = any>({
  data,
  props,
  caption,
  columns,
  CellContentWrapper,
  options = {},
  CollapsibleContent,
}: IDataTableProps<TData, TValue>) => {
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const { enableSorting = false } = options;

  const { onSort, sortBy, sortDir } = useSort();
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: sortBy || options?.initialState?.sorting?.[0]?.id || 'id',
      desc: sortDir === 'desc' || options?.initialState?.sorting?.[0]?.desc || false,
    },
  ]);

  const onSortingChange: OnChangeFn<SortingState> = useCallback(
    sortingUpdaterOrValue => {
      setSorting(prevSortingState => {
        if (!isInstanceOfFunction(sortingUpdaterOrValue)) {
          onSort({
            sortBy: sortingUpdaterOrValue[0]?.id || sortBy,
            sortDir: sortingUpdaterOrValue[0]?.desc ? 'desc' : 'asc',
          });

          return sortingUpdaterOrValue;
        }

        const newSortingState = sortingUpdaterOrValue(prevSortingState);

        onSort({
          sortBy: newSortingState[0]?.id || sortBy,
          sortDir: newSortingState[0]?.desc ? 'desc' : 'asc',
        });

        return newSortingState;
      });
    },
    [onSort, sortBy],
  );

  const { selected: ids, onSelect } = useSelect();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    checkIsBooleanishRecord(ids) ? ids : {},
  );

  const onRowSelectionChange: OnChangeFn<RowSelectionState> = useCallback(
    selectionUpdaterOrValue => {
      setRowSelection(prevSelectionState => {
        if (!isInstanceOfFunction(selectionUpdaterOrValue)) {
          onSelect(selectionUpdaterOrValue);

          return selectionUpdaterOrValue;
        }

        const newSelectionState = selectionUpdaterOrValue(prevSelectionState);

        onSelect(newSelectionState);

        return newSelectionState;
      });
    },
    [onSelect],
  );

  useEffect(() => {
    if (Object.keys(ids ?? {}).length > 0) return;

    setRowSelection({});
  }, [ids]);

  const state = useMemo(
    () => ({
      rowSelection,
      ...(enableSorting && {
        sorting,
      }),
      ...(CollapsibleContent && {
        expanded,
      }),
    }),
    [CollapsibleContent, enableSorting, expanded, rowSelection, sorting],
  );

  const table = useReactTable<TData>({
    state,
    ...options,
    data: data ?? [],
    columns: columns ?? [],
    onRowSelectionChange,
    enableRowSelection: true,
    getRowId: row => row.id,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      cell: DefaultCell,
    },
    ...(enableSorting && {
      enableSorting,
      onSortingChange,
      manualSorting: true,
      sortDescFirst: true,
      enableSortingRemoval: false,
      getSortedRowModel: getSortedRowModel(),
    }),
    ...(CollapsibleContent
      ? {
          onExpandedChange: setExpanded,
          getExpandedRowModel: getExpandedRowModel(),
        }
      : {}),
  });

  return (
    <div className="d-full relative overflow-auto rounded-md border bg-white shadow">
      <ScrollArea orientation="both" {...props?.scroll}>
        <Table {...props?.table}>
          {caption && (
            <TableCaption
              {...props?.caption}
              className={ctw('text-foreground', props?.caption?.className)}
            >
              {caption}
            </TableCaption>
          )}
          <TableHeader className="border-0" {...props?.header}>
            {table.getHeaderGroups()?.map(({ id, headers }) => (
              <TableRow
                key={id}
                {...props?.row}
                className={ctw('border-b-none', props?.row?.className)}
              >
                {headers?.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      {...props?.head}
                      className={ctw(
                        'sticky top-0 z-10 h-[34px] bg-white p-1 text-[14px] font-bold text-[#787981]',
                        {
                          '!pl-3.5': index === 0,
                        },
                        props?.head?.className,
                      )}
                    >
                      {header.column.id === 'select' && (
                        <span className={'pe-4'}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                      )}
                      {header.column.getCanSort() && header.column.id !== 'select' && (
                        <button
                          className="flex h-9 flex-row items-center gap-x-2 px-3 text-left text-[#A3A3A3]"
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
                      {!header.column.getCanSort() &&
                        !header.isPlaceholder &&
                        flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody {...props?.body}>
            {!!table.getRowModel().rows?.length &&
              table.getRowModel().rows?.map(row => (
                <React.Fragment key={row.id}>
                  <TableRow
                    key={row.id}
                    {...props?.row}
                    className={ctw(
                      'h-[76px] border-b-0 even:bg-[#F4F6FD]/50 hover:bg-[#F4F6FD]/90',
                      props?.row?.className,
                    )}
                  >
                    {row.getVisibleCells()?.map(cell => (
                      <TableCell
                        key={cell.id}
                        {...props?.cell}
                        className={ctw('!py-px !pl-3.5', props?.cell?.className)}
                      >
                        {CellContentWrapper ? (
                          <CellContentWrapper cell={cell}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </CellContentWrapper>
                        ) : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {CollapsibleContent && (
                    <Collapsible open={row.getIsExpanded()} asChild>
                      <ShadCNCollapsibleContent asChild>
                        <TableRow className={`max-h-[228px] border-y-[1px]`}>
                          <TableCell colSpan={10} className={`p-8`}>
                            <CollapsibleContent row={row.original} />
                          </TableCell>
                        </TableRow>
                      </ShadCNCollapsibleContent>
                    </Collapsible>
                  )}
                </React.Fragment>
              ))}
            {!table.getRowModel().rows?.length && (
              <TableRow
                {...props?.row}
                className={ctw('hover:bg-unset h-6 border-none', props?.row?.className)}
              >
                <TableCell
                  colSpan={columns?.length}
                  {...props?.cell}
                  className={ctw('p-4', props?.emptyCell?.className)}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};
