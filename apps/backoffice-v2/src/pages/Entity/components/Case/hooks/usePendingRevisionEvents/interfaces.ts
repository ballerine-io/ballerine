export interface IPendingEvent {
  workflowId: string;
  documentId: string;
  eventName: string;
  token: string;
}
