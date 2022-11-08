import { DecisionStatus } from '../../contexts/app-state/types';
import { VerificationStatuses } from '../../utils/event-service';

export interface ISendDocumentsResponse {
  status: 'success' | 'fail';
}

export interface IDocumentVerificationResponse {
  status: VerificationStatuses;
  idvResult?: DecisionStatus;
  code?: number;
  reasonCode?: number;
}
