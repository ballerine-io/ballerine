import { WorkflowHealthStatus } from '@common/enums';
import classnames from 'classnames';

interface Props {
  healthStatus: WorkflowHealthStatus;
  size?: number;
}

export const HealthIndicator = ({ healthStatus, size = 20 }: Props) => {
  return (
    <span
      style={{ width: `${size}px`, height: `${size}px` }}
      className={classnames('block', 'rounded-full', {
        ['bg-green-400']: healthStatus === WorkflowHealthStatus.healthy,
        ['bg-red-400']: healthStatus === WorkflowHealthStatus.failed,
        ['bg-yellow-400']: healthStatus === WorkflowHealthStatus.pending,
        ['bg-orange-400']: healthStatus === WorkflowHealthStatus['pending-longterm'],
      })}
    ></span>
  );
};
