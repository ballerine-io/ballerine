import { InputColumn, WorkflowTableColumnDef } from '@/components/molecules/WorkflowsTable/types';

export function mergeColumns<TColumnData>(
  leftColumn: WorkflowTableColumnDef<TColumnData>,
  rightColumn: InputColumn<TColumnData>,
) {
  return {
    ...leftColumn,
    ...rightColumn,
  };
}
