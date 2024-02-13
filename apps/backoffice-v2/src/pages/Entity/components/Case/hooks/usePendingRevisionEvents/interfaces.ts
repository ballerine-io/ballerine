export interface IPendingEvent {
  workflowId: string;
  workflowState: string;
  documentId: string;
  eventName: string;
  token: string;
}
