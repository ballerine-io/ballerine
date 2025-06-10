import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { alertWebhookFailure } from '@/events/alert-webhook-failure';
import { ExtractWorkflowEventData } from '@/workflow/types';
import { getWebhooks, Webhook } from '@/events/get-webhooks';
import { CustomerService } from '@/customer/customer.service';
import type { TAuthenticationConfiguration } from '@/customer/types';
import { WebhooksService } from '@/webhooks/webhooks.service';

@Injectable()
export class WorkflowStateChangedWebhookCaller implements OnModuleDestroy {
  private eventListener:
    | ((data: ExtractWorkflowEventData<'workflow.state.changed'>) => Promise<void>)
    | null = null;

  constructor(
    private workflowEventEmitter: WorkflowEventEmitterService,
    private configService: ConfigService,
    private readonly logger: AppLoggerService,
    private readonly customerService: CustomerService,
    private readonly webhooksService: WebhooksService,
  ) {
    this.eventListener = async (data: ExtractWorkflowEventData<'workflow.state.changed'>) => {
      try {
        await this.handleWorkflowEvent(data);
      } catch (error) {
        console.error(error);
        alertWebhookFailure(error);
      }
    };

    this.workflowEventEmitter.on('workflow.state.changed', this.eventListener);
  }

  async onModuleDestroy() {
    if (this.eventListener) {
      this.workflowEventEmitter.off('workflow.state.changed', this.eventListener);
      this.eventListener = null;
    }
  }

  async handleWorkflowEvent(data: ExtractWorkflowEventData<'workflow.state.changed'>) {
    const customer = await this.customerService.getByProjectId(data.runtimeData.projectId, {
      select: {
        authenticationConfiguration: true,
        subscriptions: true,
      },
    });

    const webhooks = getWebhooks({
      workflowConfig: data.runtimeData.config,
      customerSubscriptions: customer.subscriptions,
      envName: this.configService.get('ENVIRONMENT_NAME'),
      event: 'workflow.state.changed',
    });

    const { webhookSharedSecret } =
      customer.authenticationConfiguration as TAuthenticationConfiguration;

    for (const webhook of webhooks) {
      await this.sendWebhook({
        data,
        webhook,
        webhookSharedSecret,
        forceDirect: !customer.features?.WEBHOOK_QUEUE_SYSTEM_ENABLED?.enabled,
      });
    }
  }

  private async sendWebhook({
    data,
    webhook: { id, url, environment, apiVersion },
    webhookSharedSecret,
    forceDirect,
  }: {
    data: ExtractWorkflowEventData<'workflow.state.changed'>;
    webhook: Webhook;
    webhookSharedSecret: string;
    forceDirect?: boolean;
  }) {
    const payload = {
      id,
      eventName: 'workflow.state.changed',
      state: data.state,
      apiVersion,
      timestamp: new Date().toISOString(),
      workflowCreatedAt: data.runtimeData.createdAt,
      workflowResolvedAt: data.runtimeData.resolvedAt,
      workflowDefinitionId: data.runtimeData.workflowDefinitionId,
      workflowRuntimeId: data.runtimeData.id,
      ballerineEntityId: data.entityId,
      correlationId: data.correlationId,
      environment,
      data: data.runtimeData.context,
    } as const;

    await this.webhooksService.invokeWebhook(
      payload.eventName,
      { url, method: 'POST', data: payload, secret: webhookSharedSecret },
      forceDirect,
    );
  }
}
