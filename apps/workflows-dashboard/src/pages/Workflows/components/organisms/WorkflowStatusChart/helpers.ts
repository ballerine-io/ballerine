import { IWorkflowStatus } from '@/domains/workflows/api/workflow';
import { GREEN_CHART_HEX_COLOR, ORANGE_CHART_HEX_COLOR, RED_CHART_HEX_COLOR } from './consts';

export function getChartColorByWorkflowStatus(status: IWorkflowStatus): string {
  const fillColorMapByStatus: Record<IWorkflowStatus, string> = {
    active: ORANGE_CHART_HEX_COLOR,
    completed: GREEN_CHART_HEX_COLOR,
    failed: RED_CHART_HEX_COLOR,
  };

  return fillColorMapByStatus[status];
}

export function getChartLabelByStatus(status: IWorkflowStatus): string {
  const labelMapByStatus: Record<IWorkflowStatus, string> = {
    active: 'Active',
    completed: 'Completed',
    failed: 'Failed',
  };

  return labelMapByStatus[status];
}
