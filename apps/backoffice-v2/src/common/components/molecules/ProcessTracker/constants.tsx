import { StateTag } from '@ballerine/common';
import { CheckCircle2, Clock4, MinusCircle, XCircle } from 'lucide-react';

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

export const processStatusToIcon = {
  [ProcessStatus.IDLE]: <MinusCircle size={18} className={`fill-slate-500/40 stroke-white`} />,
  [ProcessStatus.IN_PROGRESS]: <Clock4 size={18} className={`fill-purple-500 stroke-white`} />,
  [ProcessStatus.SUCCESS]: <CheckCircle2 size={18} className={`fill-green-500 stroke-white`} />,
  [ProcessStatus.ERROR]: <XCircle size={18} className={`fill-red-500 stroke-white`} />,
};

export const pluginsWhiteList = ['kyb', 'ubo', 'company_sanctions'] as const;
