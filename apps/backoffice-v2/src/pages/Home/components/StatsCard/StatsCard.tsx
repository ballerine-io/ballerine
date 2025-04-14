import type { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { ctw } from '@/common/utils/ctw/ctw';

type StatsCardProps = {
  prefix?: string;
  href?: string;
  count: number;
  title: string;
  description: string;
  className?: string;
  valueClassName?: string;
  centered?: boolean;
};

export const StatsCard: FunctionComponent<StatsCardProps> = ({
  prefix = '',
  count,
  title,
  description,
  href,
  centered,
}) => {
  const Content = (
    <>
      <CardContent
        className={ctw(
          'h-full space-y-2 pt-6',
          centered && 'flex min-h-60 flex-col items-center justify-between',
        )}
      >
        <CardHeader className={ctw('p-0 font-medium', centered && 'text-center')}>
          {title}
        </CardHeader>
        <p className={ctw('text-3xl font-bold', centered && 'text-center text-5xl')}>
          {count > 0 ? `${prefix}${Intl.NumberFormat('en').format(count)}` : 0}
        </p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </>
  );

  if (href) {
    return (
      <Card className="shadow-md">
        <Link to={href}>{Content}</Link>
      </Card>
    );
  }

  return <Card className="shadow-md">{Content}</Card>;
};
