import { Method } from 'axios';

export interface WebhookJobData {
  url: string;
  method: Method;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  timeout?: number;
}
