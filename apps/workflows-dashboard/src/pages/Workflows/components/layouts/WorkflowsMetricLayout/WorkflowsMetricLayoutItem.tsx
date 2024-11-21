import classNames from 'classnames';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function WorkflowsMetricLayoutItem({ children, className }: Props) {
  return <div className={classNames('min-h-[220px] w-1/4', className)}>{children}</div>;
}

WorkflowsMetricLayoutItem.displayName = 'WorkflowsMetricLayoutItem';
