import { IWorkflow } from '@/domains/workflows/api/workflow';
import { calculateHourDifference } from '@/utils/calculate-hour-difference';

export enum HealthStatus {
  'healthy',
  'failed',
  'pending',
  'pending-longterm',
}

export function getWorkflowHealthStatus(workflow: IWorkflow): HealthStatus {
  const { status, createdAt } = workflow;

  if (status === 'failed') return HealthStatus.failed;

  if (status === 'completed') return HealthStatus.healthy;

  const hourDifference = calculateHourDifference(new Date(createdAt), new Date());
  const TWO_HOURS = 2;
  const SIX_HOURS = 6;

  if (status === 'active' && hourDifference < TWO_HOURS) {
    return HealthStatus.healthy;
  }

  if (status === 'active' && hourDifference > TWO_HOURS && hourDifference < SIX_HOURS) {
    return HealthStatus.pending;
  }

  if (status === 'active' && hourDifference > SIX_HOURS) {
    return HealthStatus['pending-longterm'];
  }

  return HealthStatus.failed;
}
