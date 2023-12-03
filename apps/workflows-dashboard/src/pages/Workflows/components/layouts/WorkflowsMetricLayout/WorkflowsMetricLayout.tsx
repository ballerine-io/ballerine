import { WorkflowsMetricLayoutItem } from '@/pages/Workflows/components/layouts/WorkflowsMetricLayout/WorkflowsMetricLayoutItem';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export function WorkflowsMetricLayout({ children }: Props) {
  return <div className="flex w-full gap-4">{children}</div>;
}

WorkflowsMetricLayout.Item = WorkflowsMetricLayoutItem;

WorkflowsMetricLayout.displayName = 'WorkflowsMetricLayout';
