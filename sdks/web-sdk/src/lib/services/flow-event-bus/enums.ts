import { ObjectValues } from '../../contexts/app-state/types';

export const FlowEvent = {
  FLOW_COMPLETE: 'FLOW_COMPLETE',
  FLOW_EXIT: 'FLOW_EXIT',
  FLOW_ERROR: 'FLOW_ERROR',
  FLOW_NAVIGATION_UPDATE: 'FLOW_NAVIGATION_UPDATE',
} as const;

export type TFlowEvent = ObjectValues<typeof FlowEvent>;
