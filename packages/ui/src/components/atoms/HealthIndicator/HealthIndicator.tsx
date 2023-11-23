import { IWorkflowHealthStatus, WorkflowHealthStatus } from '@/common/enums';
import { ctw } from '@/utils/ctw';

export interface Props {
  healthStatus: IWorkflowHealthStatus;
  size?: number;
}

export const HealthIndicator = ({ healthStatus, size = 20 }: Props) => {
  return (
    <span
      style={{ width: `${size}px`, height: `${size}px` }}
      className={ctw('block', 'rounded-full', {
        ['bg-green-400']: healthStatus === WorkflowHealthStatus.healthy,
        ['bg-red-400']: healthStatus === WorkflowHealthStatus.failed,
        ['bg-yellow-400']: healthStatus === WorkflowHealthStatus.pending,
        ['bg-orange-400']: healthStatus === WorkflowHealthStatus['pending-longterm'],
      })}
    ></span>
  );
};
