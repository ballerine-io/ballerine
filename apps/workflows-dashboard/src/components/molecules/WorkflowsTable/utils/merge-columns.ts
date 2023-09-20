import {
  InputColumn,
  WorkflowTableColumnDef,
} from '@app/components/molecules/WorkflowsTable/types';

export function mergeColumns<TColumnData>(
  leftColumn: WorkflowTableColumnDef<TColumnData>,
  rightColumn: InputColumn<TColumnData>,
) {
  return {
    ...leftColumn,
    ...rightColumn,
  };
}
