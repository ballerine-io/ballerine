import { TDecisionStatus } from '../../contexts/app-state/types';
import { TVerificationStatuses } from '../../utils/event-service/types';

export interface ISendDocumentsResponse {
  status: 'success' | 'fail';
}

export interface IDocumentVerificationResponse {
  status: TVerificationStatuses;
  idvResult?: TDecisionStatus;
  code?: number;
  reasonCode?: number;
}
