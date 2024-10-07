import { alertWebhookFailure } from '@/events/alert-webhook-failure';
import * as common from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { SentryInterceptor } from '@/sentry/sentry.interceptor';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { WebhookEventEmitterService } from './webhook-event-emitter.service';
import { IWebhookEntityEventData } from './types';
import { Webhook } from '@/events/get-webhooks';
import { AnyRecord } from '@ballerine/common';
import { env } from '@/env';
import { OutgoingWebhookQueueService } from '@/bull-mq/outgoing-webhook/outgoing-webhook-queue.service';
import { OutgoingWebhooksService } from '@/webhooks/outgoing-webhooks/outgoing-webhooks.service';

@common.Injectable()
export class WebhookHttpService {}

@common.Injectable()
@common.UseInterceptors(SentryInterceptor)
export class WebhookManagerService {
  constructor(
    private readonly cls: ClsService,
    protected readonly logger: AppLoggerService,
    protected readonly outgoingQueueWebhookService: OutgoingWebhookQueueService,
    protected readonly outgoingWebhookService: OutgoingWebhooksService,
    protected readonly webhookEventEmitter: WebhookEventEmitterService,
  ) {
    webhookEventEmitter.on('*', async (eventData: any) => {
      try {
        await this.sendWebhook(eventData);
      } catch (error) {
        this.logger.error('webhookEventEmitter::*', {
          error,
        });
        alertWebhookFailure(error);
      }
    });
  }

  private async sendWebhook<T>({
    data,
    webhook,
    webhookSharedSecret,
  }: {
    data: IWebhookEntityEventData<T>;
    webhook: Webhook;
    webhookSharedSecret: string;
  }) {
    const { id, url, environment, apiVersion } = webhook;

    if (env.QUEUE_SYSTEM_ENABLED) {
      return await this.outgoingQueueWebhookService.addJob({
        requestConfig: {
          url,
          method: 'POST',
          headers: {},
          body: data as unknown as AnyRecord,
          timeout: 15_000,
        },
        customerConfig: {
          webhookSharedSecret,
        },
      });
    }

    try {
      this.logger.log('Sending webhook', { id, url });

      const response = await this.outgoingWebhookService.invokeWebhook({
        requestConfig: {
          url,
          method: 'POST',
          headers: {},
          body: data as unknown as AnyRecord,
          timeout: 15_000,
        },
        customerConfig: {
          webhookSharedSecret,
        },
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Webhook failed with status ${response.status} for ${url}`);
      }
    } catch (error: Error | any) {
      this.logger.error('Webhook error data', {
        data,
        error,
        webhook,
      });

      alertWebhookFailure(error);
    }
  }
}
