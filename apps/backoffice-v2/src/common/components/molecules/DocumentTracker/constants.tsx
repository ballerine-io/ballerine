import { CheckCircle } from '@ballerine/ui';
import { FilePlus2Icon } from 'lucide-react';
import { ReactNode } from 'react';

import { ClockCircle } from '@/common/components/atoms/ClockCircle/ClockCircle';
import { IndicatorCircle } from '@/common/components/atoms/IndicatorCircle/IndicatorCircle';
import { XCircle } from '@/common/components/atoms/XCircle/XCircle';
import { TDocumentsTrackerItem } from '@/domains/documents/schemas';

export const Icon = {
  CHECK: (
    <CheckCircle
      size={18}
      className={`stroke-success`}
      containerProps={{
        className: 'bg-success/20',
      }}
    />
  ),
  X: (
    <XCircle
      size={18}
      className={`stroke-destructive`}
      containerProps={{
        className: 'bg-destructive/20',
      }}
    />
  ),
  INDICATOR: (
    <IndicatorCircle
      size={18}
      className={`stroke-transparent`}
      containerProps={{
        className: 'bg-slate-500/20',
      }}
    />
  ),
  REQUESTED: (
    <ClockCircle
      size={18}
      className={`fill-violet-500 stroke-white`}
      containerProps={{
        className: 'bg-violet-500/20',
      }}
    />
  ),
  MARKED: <FilePlus2Icon className="stroke-warning" size={16.5} />,
} as const;

export const documentStatusToIcon: Record<
  TDocumentsTrackerItem['business'][number]['status'],
  ReactNode
> = {
  unprovided: Icon.INDICATOR,
  provided: Icon.CHECK,
  requested: Icon.REQUESTED,
} as const;
