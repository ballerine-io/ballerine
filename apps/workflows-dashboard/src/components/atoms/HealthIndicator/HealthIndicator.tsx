import { HealthStatus } from '@/utils/get-workflow-health-status';
import classnames from 'classnames';

interface Props {
  healthStatus: HealthStatus;
  size?: number;
}

export const HealthIndicator = ({ healthStatus, size = 20 }: Props) => {
  return (
    <span
      style={{ width: `${size}px`, height: `${size}px` }}
      className={classnames('block', 'rounded-full', {
        ['bg-green-400']: healthStatus === HealthStatus.healthy,
        ['bg-red-400']: healthStatus === HealthStatus.failed,
        ['bg-yellow-400']: healthStatus === HealthStatus.pending,
        ['bg-orange-400']: healthStatus === HealthStatus['pending-longterm'],
      })}
    ></span>
  );
};
