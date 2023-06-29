import * as classnames from 'classnames';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@app/components/atoms/Card';
import { MetricCardContent } from '@app/components/molecules/MetricCard/MetricCardContent';
import { MetricCardTitle } from '@app/components/molecules/MetricCard/MetricCardTitle';
import { Skeleton } from '@app/components/atoms/Skeleton';

interface Props {
  className?: string;
  isLoading?: boolean;
  title: React.ReactNode;
  content?: React.ReactNode;
  description?: string;
}

export function MetricCard({ title, content, description, className, isLoading }: Props) {
  return (
    <Card className={classnames('flex flex-col flex-nowrap', className)}>
      <CardHeader className="p-4">{isLoading ? <Skeleton className="h-6" /> : title}</CardHeader>
      <CardContent className={classnames('flex-1 p-4')}>
        {isLoading ? (
          <Skeleton className="h-20" />
        ) : (
          <div
            className={classnames('w-full', 'h-full', {
              ['border-b-2']: Boolean(description),
            })}
          >
            {content}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <CardDescription className="w-full">
          {isLoading ? <Skeleton className="h-6" /> : description}
        </CardDescription>
      </CardFooter>
    </Card>
  );
}

MetricCard.Title = MetricCardTitle;
MetricCard.Content = MetricCardContent;
