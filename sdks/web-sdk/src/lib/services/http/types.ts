import { DecisionStatus } from '../../contexts/app-state/types';
import { EVerificationStatuses } from '../../utils/event-service';

export interface ISendDocumentsResponse {
  status: 'success' | 'fail';
}

export interface IDocumentVerificationResponse {
  status: EVerificationStatuses;
  idvResult?: DecisionStatus;
  code?: number;
  reasonCode?: number;
}
