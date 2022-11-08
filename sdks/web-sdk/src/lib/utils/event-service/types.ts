import { DecisionStatus } from '../../contexts/app-state/types';

export enum EventTypes {
  SYNC_FLOW_COMPLETE = 'sync_flow_complete',
  VERIFICATION_UPDATE = 'verification_update',
  NAVIGATION_UPDATE = 'navigation_update',
  BUTTON_CLICK = 'button_click'
}

export enum ActionNames {
  CLOSE = 'close',
}

export enum VerificationStatuses {
  COMPLETED = 'completed',
  PENDING = 'pending',
  ERROR = 'error',
  DATA_COLLECTION = 'data_collection'
}

export interface ISendDocumentsResponse {
  status: 'success' | 'fail';
}

export interface IDocumentVerificationResponse {
  status: VerificationStatuses;
  idvResult?: DecisionStatus;
  code?: number;
  reasonCode?: number;
}

export interface IOuterEvent {
  eventName: string;
  config: Record<string, string>;
  shouldExit: boolean;
}
