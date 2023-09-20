interface Props {
  children: React.ReactNode;
}

export function WorkflowsMetricLayoutItem({ children }: Props) {
  return <div className="min-h-[220px] w-1/4">{children}</div>;
}

WorkflowsMetricLayoutItem.displayName = 'WorkflowsMetricLayoutItem';
