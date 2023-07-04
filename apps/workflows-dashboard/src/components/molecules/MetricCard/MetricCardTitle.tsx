import { CardTitle } from '@app/components/atoms/Card';

interface Props {
  title: React.ReactNode;
  className?: string;
}

export function MetricCardTitle({ title, className }: Props) {
  return <CardTitle className={className}>{title}</CardTitle>;
}

MetricCardTitle.displayName = 'MetricCardTitle';
