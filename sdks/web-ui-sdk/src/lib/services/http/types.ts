import { TDecisionStatus } from '../../contexts/app-state/types';
import { TVerificationStatuses } from '../../utils/event-service/types';

export interface ISendDocumentsResponse {
  id: string;
}

export interface IDocumentVerificationResponse {
  status: TVerificationStatuses;
  idvResult?: TDecisionStatus;
  code?: number;
  reasonCode?: number;
}
