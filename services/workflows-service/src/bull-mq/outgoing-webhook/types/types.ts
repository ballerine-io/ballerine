import { OutgoingWebhooksService } from '@/webhooks/outgoing-webhooks/outgoing-webhooks.service';

export type WebhookJobData = Parameters<OutgoingWebhooksService['invokeWebhook']>[0];
