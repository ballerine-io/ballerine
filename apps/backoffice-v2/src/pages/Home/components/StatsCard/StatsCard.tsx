import { ArrowDownRightIcon, ArrowUpRightIcon } from 'lucide-react';
import type { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { ctw } from '@/common/utils/ctw/ctw';
import { WarningSvg } from '@/common/components/atoms/icons';
import { WarningFilledSvg } from '@ballerine/ui';

type StatsCardProps = {
  prefix?: string;
  href?: string;
  value: number | string;
  title: string;
  description: string;
  className?: string;
  valueClassName?: string;
  centered?: boolean;
  style?: React.CSSProperties;
  alert?: boolean;
  tendency?: {
    value: number | string;
    direction: 'up' | 'down';
    kind: 'positive' | 'negative' | 'neutral';
  };
};

export const StatsCard: FunctionComponent<StatsCardProps> = ({
  prefix = '',
  value,
  title,
  description,
  href,
  centered,
  tendency,
  className,
  style,
  alert,
}) => {
  const Content = (
    <>
      <CardContent
        className={ctw(
          'h-full space-y-2 pt-6',
          centered && 'min-h-60 flex flex-col items-center justify-between',
        )}
      >
        <CardHeader
          className={ctw(
            'flex-row justify-between gap-4 p-0 font-medium',
            centered && 'text-center',
          )}
        >
          {title}
          {tendency && (
            <div>
              <div
                className={ctw(
                  'flex items-center gap-0.5 rounded-sm px-1 py-0 text-sm font-medium',
                  tendency.kind === 'positive' && 'bg-green-100 text-green-600',
                  tendency.kind === 'negative' && 'bg-red-100 text-red-600',
                  tendency.kind === 'neutral' && 'bg-gray-100 text-gray-600',
                )}
              >
                <span>{tendency.value}</span>
                {tendency.direction === 'up' ? (
                  <ArrowUpRightIcon className="d-4" />
                ) : (
                  <ArrowDownRightIcon className="d-4" />
                )}
              </div>
            </div>
          )}
        </CardHeader>
        <div className="flex items-center gap-4">
          {alert && <WarningFilledSvg className={'mt-1 d-10'} />}
          <p className={ctw('text-3xl font-bold', centered && 'text-center text-5xl')}>
            {typeof value === 'number' && value > 0
              ? `${prefix}${Intl.NumberFormat('en').format(value)}`
              : value ?? 0}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </>
  );

  if (href) {
    return (
      <Card className={ctw('shadow-md', className)} style={style}>
        <Link to={href}>{Content}</Link>
      </Card>
    );
  }

  return (
    <Card className={ctw('shadow-md', className)} style={style}>
      {Content}
    </Card>
  );
};
