export const UNIFIED_API_URL = 'https://test-unified.com' as const;
export const EMAIL_API_URL = 'https://test-email.com' as const;
export const WEBH00K_URL = 'https://test-webhook.com' as const;
export const COLLECTION_FLOW_URL = 'https://test-collection-flow.com' as const;
export const Event = {
  START: 'START',
  INVITATION_SENT: 'INVITATION_SENT',
  INVIATION_FAILURE: 'INVIATION_FAILURE',
  COLLECTION_FLOW_FINISHED: 'COLLECTION_FLOW_FINISHED',
  KYC_RESPONDED: 'KYC_RESPONDED',
} as const;
export const State = {
  COLLECTION_INVITE: 'collection_invite',
  COLLECTION_FLOW: 'collection_flow',
  FAILED: 'failed',
  RUN_KYB_ENRICHMENT: 'run_kyb_enrichment',
  RUN_UBOS: 'run_ubos',
  PENDING_KYC_RESPONSE_TO_FINISH: 'pending_kyc_response_to_finish',
  MANUAL_REVIEW: 'manual_review',
} as const;
