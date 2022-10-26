export interface ISendDocumentsResponse {
  status: 'success' | 'fail';
}

export enum DecisionStatus {
  APPROVED = 'approved',
  RESUBMISSION_REQUESTED = 'resubmission_requested',
  DECLINED = 'declined',
  EXPIRED = 'expired',
  ABANDONED = 'abandoned',
  REVIEW = 'review',
}

export interface IDocumentVerificationResponse {
  status: 'completed' | 'pending' | 'error' | 'document_collection';
  idvResult?: DecisionStatus;
  code?: number;
  reasonCode?: number;
}
