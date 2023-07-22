import { InputColumn, WorkflowTableColumnDef } from '../types';
export declare function mergeColumns<TColumnData>(
  leftColumn: WorkflowTableColumnDef<TColumnData>,
  rightColumn: InputColumn<TColumnData>,
): WorkflowTableColumnDef<TColumnData>;
