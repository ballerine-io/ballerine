interface Props {
  children: React.ReactNode;
}

export function WorkflowsMetricLayoutItem({ children }: Props) {
  return <div className="w-1/4">{children}</div>;
}

WorkflowsMetricLayoutItem.displayName = 'WorkflowsMetricLayoutItem';
