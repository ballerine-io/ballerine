import { ProcessStatus, StateTag } from '@ballerine/common';
import { CheckCircle2, Clock4, MinusCircle, RefreshCcw, XCircle } from 'lucide-react';

export const tagToAccordionCardItem = {
  [StateTag.COLLECTION_FLOW]: 'Collection flow',
  [StateTag.REVISION]: 'Collection flow',
  [StateTag.DATA_ENRICHMENT]: '3rd party processes',
  [StateTag.PENDING_PROCESS]: 'UBO flows',
} as const;

export const Icon = {
  MINUS: <MinusCircle size={18} className={`fill-slate-500/40 stroke-white`} />,
  CLOCK: <Clock4 size={18} className={`fill-violet-500 stroke-white`} />,
  CHECK: <CheckCircle2 size={18} className={`fill-success stroke-white`} />,
  X: <XCircle size={18} className={`fill-destructive stroke-white`} />,
  REFRESH: <RefreshCcw size={18} className={`fill-warning stroke-white`} />,
};

export const processStatusToIcon = {
  DEFAULT: Icon.MINUS,
  [ProcessStatus.IDLE]: Icon.MINUS,
  [ProcessStatus.IN_PROGRESS]: Icon.CLOCK,
  [ProcessStatus.SUCCESS]: Icon.CHECK,
  [ProcessStatus.ERROR]: Icon.X,
};

export const tagToIcon = {
  DEFAULT: Icon.MINUS,
  [StateTag.PENDING_PROCESS]: Icon.CLOCK,
  [StateTag.DATA_ENRICHMENT]: Icon.CLOCK,
  [StateTag.MANUAL_REVIEW]: Icon.CHECK,
  [StateTag.APPROVED]: Icon.CHECK,
  [StateTag.REJECTED]: Icon.CHECK,
  [StateTag.FAILURE]: Icon.X,
  [StateTag.REVISION]: Icon.REFRESH,
};

export const pluginsWhiteList = ['kyb', 'ubo', 'company_sanctions'] as const;
