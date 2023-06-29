import { CardTitle } from '@app/components/atoms/Card';

interface Props {
  title: React.ReactNode;
}

export function MetricCardTitle({ title }: Props) {
  return <CardTitle>{title}</CardTitle>;
}

MetricCardTitle.displayName = 'MetricCardTitle';
