import { MetricCard } from '@/components/molecules/MetricCard';
import { DurationCardContent } from '@/pages/Overview/components/molecules/UserStats/components/DurationCard/DurationCardContent';
import { memo } from 'react';

interface Props {
  title: string;
  isLoading: boolean;
  duration: number;
}

export const DurationCard = memo(({ title, isLoading, duration }: Props) => {
  return (
    <MetricCard
      title={<MetricCard.Title className="text-sm" title={title} />}
      content={
        <span className="text-3xl font-bold">
          <DurationCardContent duration={duration} />
        </span>
      }
      description="( last 30 days )"
      isLoading={isLoading}
    />
  );
});
