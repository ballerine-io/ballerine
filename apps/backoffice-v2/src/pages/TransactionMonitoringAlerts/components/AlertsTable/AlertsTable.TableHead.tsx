import { TableHead as TableHeadBase } from '@/common/components/atoms/Table';
import { DropdownMenu } from '@/common/components/molecules/DropdownMenu/DropdownMenu';
import { DropdownMenuContent } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Content';
import { DropdownMenuItem } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Item';
import { DropdownMenuSeparator } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Separator';
import { DropdownMenuTrigger } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Trigger';
import { AnyChildren } from '@ballerine/ui';
import { Column } from '@tanstack/react-table';
import { ChevronsUpDown, EyeOff, SortAsc, SortDesc } from 'lucide-react';
import { FunctionComponent } from 'react';

export interface TableHeadProps {
  children: AnyChildren;
  column: Column<any>;
}

export const TableHead: FunctionComponent<TableHeadProps> = ({ children, column }) => {
  return (
    <TableHeadBase className="text-[#787981 sticky top-0 h-[34px] bg-white p-0 text-[14px] font-bold">
      <div className="flex flex-col">
        <div className="flex flex-1 px-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="-ml-3 flex h-8 h-9 flex-row items-center px-3 outline-none data-[state=open]:bg-accent">
                <span className="text-[#A3A3A3]">{children}</span>
                {column.getIsSorted() === 'desc' ? (
                  <SortDesc className="ml-2 h-4 w-4 text-[#A3A3A3]" />
                ) : column.getIsSorted() === 'asc' ? (
                  <SortAsc className="ml-2 h-4 w-4 text-[#A3A3A3]" />
                ) : (
                  <ChevronsUpDown className="ml-2 h-4 w-4 text-[#A3A3A3]" />
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <SortAsc className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <SortDesc className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                Desc
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                Hide
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="border-b" />
      </div>
    </TableHeadBase>
  );
};
