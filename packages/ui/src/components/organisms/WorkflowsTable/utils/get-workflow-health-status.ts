import { calculateHourDifference } from './calculate-hour-difference';
import { WorkflowTableItem } from '../types';
import { IWorkflowHealthStatus, WorkflowHealthStatus } from '@/common/enums';

export function getWorkflowHealthStatus(workflow: WorkflowTableItem): IWorkflowHealthStatus {
  const { status, createdAt } = workflow;

  if (status === 'failed') return WorkflowHealthStatus.failed;

  if (status === 'completed') return WorkflowHealthStatus.healthy;

  const hourDifference = calculateHourDifference(new Date(createdAt), new Date());
  const TWO_HOURS = 2;
  const SIX_HOURS = 6;

  if (status === 'active' && hourDifference < TWO_HOURS) {
    return WorkflowHealthStatus.healthy;
  }

  if (status === 'active' && hourDifference > TWO_HOURS && hourDifference < SIX_HOURS) {
    return WorkflowHealthStatus.pending;
  }

  if (status === 'active' && hourDifference > SIX_HOURS) {
    return WorkflowHealthStatus['pending-longterm'];
  }

  return WorkflowHealthStatus.failed;
}
