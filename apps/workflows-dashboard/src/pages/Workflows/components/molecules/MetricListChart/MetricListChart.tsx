import { MetricCard } from '@/components/molecules/MetricCard';
import Scrollbars from 'react-custom-scrollbars';

interface Props {
  isLoading?: boolean;
  items: React.ReactNode[];
  title: string;
  description?: string;
  emptyPlaceholder?: React.ReactNode;
}

export const MetricListChart = ({
  title,
  description,
  items,
  isLoading,
  emptyPlaceholder = null,
}: Props) => {
  const isEmpty = !isLoading && !items.length;

  return (
    <MetricCard
      isLoading={isLoading}
      title={<MetricCard.Title title={title} />}
      description={description}
      content={
        <MetricCard.Content>
          <div className="flex h-full pb-2">
            <Scrollbars>
              <div className="flex flex-col gap-1 pr-4">{isEmpty ? emptyPlaceholder : items}</div>
            </Scrollbars>
          </div>
        </MetricCard.Content>
      }
    />
  );
};
