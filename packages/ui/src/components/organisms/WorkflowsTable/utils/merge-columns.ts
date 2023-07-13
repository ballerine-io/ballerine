import { InputColumn, WorkflowTableColumnDef } from '../types';

export function mergeColumns<TColumnData>(
  leftColumn: WorkflowTableColumnDef<TColumnData>,
  rightColumn: InputColumn<TColumnData>,
): WorkflowTableColumnDef<TColumnData> {
  return {
    ...leftColumn,
    ...rightColumn,
  };
}
