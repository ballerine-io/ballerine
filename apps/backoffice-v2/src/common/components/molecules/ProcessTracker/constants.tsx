import { StateTag } from '@ballerine/common';
import { CheckCircle2, Clock4, MinusCircle, RefreshCcw, XCircle } from 'lucide-react';

export const tagToAccordionCardItem = {
  [StateTag.COLLECTION_FLOW]: 'Collection flow',
  [StateTag.DATA_ENRICHMENT]: '3rd party processes',
  [StateTag.PENDING_PROCESS]: 'UBO flows',
} as const;

export const ProcessStatus = {
  IDLE: 'IDLE',
  IN_PROGRESS: 'IN_PROGRESS',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
} as const;

export const ProcessStatuses = [
  ProcessStatus.IDLE,
  ProcessStatus.IN_PROGRESS,
  ProcessStatus.SUCCESS,
  ProcessStatus.ERROR,
] as const satisfies ReadonlyArray<keyof typeof ProcessStatus>;

export const Icon = {
  MINUS: <MinusCircle size={18} className={`fill-slate-500/40 stroke-white`} />,
  CLOCK: <Clock4 size={18} className={`fill-violet-500 stroke-white`} />,
  CHECK: <CheckCircle2 size={18} className={`fill-success stroke-white`} />,
  X: <XCircle size={18} className={`fill-destructive stroke-white`} />,
  REFRESH: <RefreshCcw size={18} className={`fill-warning stroke-white`} />,
};

export const processStatusToIcon = {
  [ProcessStatus.IDLE]: Icon.MINUS,
  [ProcessStatus.IN_PROGRESS]: Icon.CLOCK,
  [ProcessStatus.SUCCESS]: Icon.CHECK,
  [ProcessStatus.ERROR]: Icon.X,
};

export const tagToIcon = {
  DEFAULT: Icon.MINUS,
  [StateTag.PENDING_PROCESS]: Icon.CLOCK,
  [StateTag.MANUAL_REVIEW]: Icon.CHECK,
  [StateTag.FAILURE]: Icon.X,
  [StateTag.REVISION]: Icon.REFRESH,
};

export const pluginsWhiteList = ['kyb', 'ubo', 'company_sanctions'] as const;
