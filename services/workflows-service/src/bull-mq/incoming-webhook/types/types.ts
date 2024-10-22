export interface IncomingWebhookData {
  source: string;
  payload: Record<string, unknown>;
  service: (payload: Record<string, unknown>) => Promise<void>;
}
