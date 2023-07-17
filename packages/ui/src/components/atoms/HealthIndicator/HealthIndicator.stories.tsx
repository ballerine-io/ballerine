import { WorkflowHealthStatus } from '@common/enums';
import { HealthIndicator } from '@components/atoms/HealthIndicator/HealthIndicator';

export default {
  component: HealthIndicator,
};

export const Healthy = {
  render: () => <HealthIndicator healthStatus={WorkflowHealthStatus.healthy} />,
};

export const Failed = {
  render: () => <HealthIndicator healthStatus={WorkflowHealthStatus.failed} />,
};

export const Pending = {
  render: () => <HealthIndicator healthStatus={WorkflowHealthStatus.pending} />,
};

export const PendingLongterm = {
  render: () => <HealthIndicator healthStatus={WorkflowHealthStatus['pending-longterm']} />,
};
