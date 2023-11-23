import classnames from 'classnames';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/atoms/Card';
import { MetricCardContent } from '@/components/molecules/MetricCard/MetricCardContent';
import { MetricCardTitle } from '@/components/molecules/MetricCard/MetricCardTitle';
import { Skeleton } from '@/components/atoms/Skeleton';

interface Props {
  className?: string;
  isLoading?: boolean;
  title: React.ReactNode;
  content?: React.ReactNode;
  description?: string;
}

export function MetricCard({ title, content, description, className, isLoading }: Props) {
  return (
    <Card className={classnames('flex h-full flex-col flex-nowrap', className)}>
      {isLoading ? (
        <Skeleton className="ml-4 mr-4 mt-4 h-6" />
      ) : (
        <CardHeader className="dfgdf p-4">{title}</CardHeader>
      )}
      <CardContent className={classnames('flex-1 p-4 pb-2')}>
        {isLoading ? (
          <Skeleton className="h-20" />
        ) : (
          <div className={classnames('w-full', 'h-full')}>{content}</div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {isLoading ? (
          <Skeleton className="h-6" />
        ) : description ? (
          <CardDescription className="w-full text-xs">{description}</CardDescription>
        ) : null}
      </CardFooter>
    </Card>
  );
}

MetricCard.Title = MetricCardTitle;
MetricCard.Content = MetricCardContent;
