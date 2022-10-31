import { DecisionStatus } from '../../contexts/app-state/types';

export interface ISendDocumentsResponse {
  status: 'success' | 'fail';
}

export interface IDocumentVerificationResponse {
  status: 'completed' | 'pending' | 'error' | 'document_collection';
  idvResult?: DecisionStatus;
  code?: number;
  reasonCode?: number;
}
