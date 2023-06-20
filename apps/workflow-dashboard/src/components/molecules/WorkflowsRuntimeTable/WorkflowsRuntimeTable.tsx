import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@app/components/atoms/Table';
import { IWorkflowRuntime } from '@app/domains/workflows-runtime/api/workflows-runtime';
import { memo } from 'react';
import * as classnames from 'classnames';

interface Props {
  items: IWorkflowRuntime[];
  isFetching?: boolean;
}

export const WorkflowsRuntimeTable = memo(({ items, isFetching }: Props) => {
  return (
    <div
      className={classnames('bg-white', {
        ['opacity-40']: isFetching,
        ['pointer-events-none']: isFetching,
      })}
    >
      <Table className="relative h-full rounded-md ">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">ID</TableHead>
            <TableHead className="w-1/4">Status</TableHead>
            <TableHead className="w-1/4">Last Update</TableHead>
            <TableHead className="w-1/4">Context</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-scroll">
          {items.map(item => {
            return (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{new Date(item.updatedAt).toDateString()}</TableCell>
                <TableCell>{item.context.toString()}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
});
