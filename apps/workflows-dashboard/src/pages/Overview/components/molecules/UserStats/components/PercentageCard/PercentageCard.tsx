import { MetricCard } from '@app/components/molecules/MetricCard';
import { memo } from 'react';

interface Props {
  title: string;
  percentage: number;
  isLoading: boolean;
}

export const PercentageCard = memo(({ title, percentage, isLoading }: Props) => {
  return (
    <MetricCard
      title={<MetricCard.Title className="text-sm" title={title} />}
      content={<span className="text-3xl font-bold">{`${percentage.toFixed(0)}%`}</span>}
      description="( last 30 days )"
      isLoading={isLoading}
    />
  );
});
