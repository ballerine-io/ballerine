import { ObjectValues, TDecisionStatus } from '../../contexts/app-state/types';

export const EventTypes = {
  SYNC_FLOW_COMPLETE: 'sync_flow_complete',
  ASYNC_FLOW_COMPLETE: 'async_flow_complete',
  VERIFICATION_UPDATE: 'verification_update',
  NAVIGATION_UPDATE: 'navigation_update',
  BUTTON_CLICK: 'button_click',
  FLOW_ERROR: 'flow_error',
} as const;

export type TEventTypes = ObjectValues<typeof EventTypes>;

export const ActionNames = {
  CLOSE: 'close',
};

export type TActionNames = ObjectValues<typeof ActionNames>;

export const VerificationStatuses = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  ERROR: 'error',
  DATA_COLLECTION: 'data_collection',
} as const;

export type TVerificationStatuses = ObjectValues<typeof VerificationStatuses>;

export interface ISendDocumentsResponse {
  status: 'success' | 'fail';
}

export interface IDocumentVerificationResponse {
  status: TVerificationStatuses;
  idvResult?: TDecisionStatus;
  code?: number;
  reasonCode?: number;
}

export interface IOuterEvent {
  eventName: string;
  config: Record<string, string>;
  shouldExit: boolean;
}
