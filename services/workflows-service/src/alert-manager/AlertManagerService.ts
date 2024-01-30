import { lastValueFrom, tap } from 'rxjs';
import { sign } from '@/common/utils/sign/sign';
import { alertWebhookFailure } from '@/events/alert-webhook-failure';
import { Webhook } from '@/events/get-webhooks';
import { DefaultContextSchema } from '@ballerine/common';
import { HttpService } from '@nestjs/axios';
import * as common from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClsService } from 'nestjs-cls';
import { SentryInterceptor } from '@/sentry/sentry.interceptor';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { ExtractWorkflowEventData } from '@/workflow/types';

@common.Injectable()
@common.UseInterceptors(SentryInterceptor)
export class AlertManagerService {
  constructor(
    private readonly cls: ClsService,
    protected readonly logger: AppLoggerService,
    protected readonly configService: ConfigService,
    protected readonly httpService: HttpService,
  ) {}

  public async testApiCall() {
    const res = await lastValueFrom(this.httpService.get('https://javascript.call.io'));
  }
  catch(error: Error | any) {
    this.logger.error('Failed to send webhook', {
      error,
    });

    throw error;
  }

  private async sendWebhook({
    data,
    newDocumentsByIdentifier,
    oldDocuments,
    webhook: { id, url, environment, apiVersion },
    webhookSharedSecret,
  }: {
    data: ExtractWorkflowEventData<'workflow.context.changed'>;
    newDocumentsByIdentifier: Record<string, DefaultContextSchema['documents'][number]>;
    oldDocuments: DefaultContextSchema['documents'];
    webhook: Webhook;
    webhookSharedSecret: string;
  }) {
    this.logger.log('Sending webhook', { id, url });

    try {
      const payload = {
        id,
        eventName: 'workflow.context.document.changed',
        apiVersion,
        timestamp: new Date().toISOString(),
        workflowCreatedAt: data.updatedRuntimeData.createdAt,
        workflowResolvedAt: data.updatedRuntimeData.resolvedAt,
        workflowDefinitionId: data.updatedRuntimeData.workflowDefinitionId,
        workflowRuntimeId: data.updatedRuntimeData.id,
        ballerineEntityId: data.entityId,
        correlationId: data.correlationId,
        environment,
        data: data.updatedRuntimeData.context,
      };

      const res = this.httpService.post(url, payload, {
        headers: {
          'X-Authorization': this.configService.getOrThrow('WEBHOOK_SECRET'),
          'X-HMAC-Signature': sign({ payload, key: webhookSharedSecret }),
        },
      });
    } catch (error: Error | any) {
      this.logger.error('Failed to send webhook', {
        id,
        message: error?.message,
        error,
        webhookDetails: {
          newDocumentsByIdentifier,
          state: data.state,
          entityId: data.entityId,
          correlationId: data.correlationId,
          id: data.updatedRuntimeData.id,
          oldDocuments,
        },
      });
      alertWebhookFailure(error);
    }
  }
}
