import { ProcessStatus, StateTag } from '@ballerine/common';
import { RefreshCircle } from '@/common/components/atoms/RefreshCircle/RefreshCircle';
import { ClockCircle } from '@/common/components/atoms/ClockCircle/ClockCircle';
import { XCircle } from '@/common/components/atoms/XCircle/XCircle';
import { MinusCircle } from '@/common/components/atoms/MinusCircle/MinusCircle';
import { CheckCircle } from '@/common/components/atoms/CheckCircle/CheckCircle';
import { IndicatorCircle } from '@/common/components/atoms/IndicatorCircle/IndicatorCircle';

export const tagToAccordionCardItem = {
  [StateTag.COLLECTION_FLOW]: 'Collection flow',
  [StateTag.REVISION]: 'Collection flow',
  [StateTag.DATA_ENRICHMENT]: '3rd party processes',
  [StateTag.PENDING_PROCESS]: 'UBO flows',
} as const;

export const Icon = {
  MINUS: (
    <MinusCircle
      size={18}
      className={`stroke-slate-500`}
      containerProps={{
        className: 'bg-slate-500/20',
      }}
    />
  ),
  CLOCK: (
    <ClockCircle
      size={18}
      className={`fill-violet-500 stroke-white`}
      containerProps={{
        className: 'bg-violet-500/20',
      }}
    />
  ),
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
  REFRESH: (
    <RefreshCircle
      size={18}
      className={`stroke-warning`}
      containerProps={{
        className: 'bg-warning/20',
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
} as const;

export const processStatusToIcon = {
  DEFAULT: Icon.INDICATOR,
  [ProcessStatus.IDLE]: Icon.INDICATOR,
  [ProcessStatus.IN_PROGRESS]: Icon.CLOCK,
  [ProcessStatus.SUCCESS]: Icon.CHECK,
  [ProcessStatus.ERROR]: Icon.X,
  [ProcessStatus.CANCELED]: Icon.MINUS,
} as const;

export const tagToIcon = {
  DEFAULT: Icon.INDICATOR,
  [StateTag.PENDING_PROCESS]: Icon.CLOCK,
  [StateTag.DATA_ENRICHMENT]: Icon.CLOCK,
  [StateTag.MANUAL_REVIEW]: Icon.CHECK,
  [StateTag.APPROVED]: Icon.CHECK,
  [StateTag.REJECTED]: Icon.CHECK,
  [StateTag.FAILURE]: Icon.X,
  [StateTag.REVISION]: Icon.REFRESH,
} as const;

export const pluginsWhiteList = ['kyb', 'ubo', 'company_sanctions'] as const;
