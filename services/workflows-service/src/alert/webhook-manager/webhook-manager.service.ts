import { alertWebhookFailure } from '@/events/alert-webhook-failure';
import { lastValueFrom } from 'rxjs';
import * as common from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClsService } from 'nestjs-cls';
import { SentryInterceptor } from '@/sentry/sentry.interceptor';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { WebhookEventEmitterService } from './webhook-event-emitter.service';
import { IWebhookEntityEventData } from './types';
import { Webhook } from '@/events/get-webhooks';
import { HttpService } from '@nestjs/axios';
import { sign } from '@ballerine/common';

@common.Injectable()
export abstract class WebhookHttpService extends HttpService {}

@common.Injectable()
@common.UseInterceptors(SentryInterceptor)
export class WebhookManagerService {
  constructor(
    private readonly cls: ClsService,
    protected readonly logger: AppLoggerService,
    protected readonly configService: ConfigService,
    protected readonly httpService: WebhookHttpService,
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
    try {
      const { id, url, environment, apiVersion } = webhook;

      this.logger.log('Sending webhook', { id, url });

      const res = await lastValueFrom(
        this.httpService.post(url, data, {
          headers: {
            'X-HMAC-Signature': sign({
              payload: data,
              key: webhookSharedSecret,
            }),
          },
        }),
      );
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
