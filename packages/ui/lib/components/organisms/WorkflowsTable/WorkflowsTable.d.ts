import { InputColumn, WorkflowsTableSorting } from './types';
import { WorkflowTableItem } from './types';
import { TableContainer } from './components/TableContainer';
interface Props {
  items: WorkflowTableItem[];
  sorting?: WorkflowsTableSorting;
  isFetching?: boolean;
  columns?: InputColumn[];
  onSort: (key: string, direction: 'asc' | 'desc') => void;
}
export declare function WorkflowsTable({
  items,
  isFetching,
  sorting,
  columns,
  onSort,
}: Props): JSX.Element;
export declare namespace WorkflowsTable {
  var Container: typeof TableContainer;
  var ScrollContainer: typeof import('./components/ScrollContainer').ScrollContainer;
}
export {};
