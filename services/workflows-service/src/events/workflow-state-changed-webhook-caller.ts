/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosInstance } from 'axios';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { alertWebhookFailure } from '@/events/alert-webhook-failure';
import { getDynamicWebhookUrl } from '@/events/get-dynamic-webhook-url';
import { ExtractWorkflowEventData } from '@/workflow/types';

@Injectable()
export class WorkflowStateChangedWebhookCaller {
  #__axios: AxiosInstance;

  constructor(
    private httpService: HttpService,
    private workflowEventEmitter: WorkflowEventEmitterService,
    private configService: ConfigService,
    private readonly logger: AppLoggerService,
  ) {
    this.#__axios = this.httpService.axiosRef;

    workflowEventEmitter.on('workflow.state.changed', async data => {
      try {
        await this.handleWorkflowEvent(data);
      } catch (error) {
        console.error(error);
        alertWebhookFailure(error);
      }
    });
  }

  async handleWorkflowEvent(data: ExtractWorkflowEventData<'workflow.state.changed'>) {
    this.logger.log('handleWorkflowEvent:: ', {
      state: data.state,
      entityId: data.entityId,
      correlationId: data.correlationId,
      id: data.runtimeData.id,
    });

    const id = randomUUID();
    const environment = this.configService.get<string>('NODE_ENV');
    const url =
      getDynamicWebhookUrl(data.runtimeData?.config, 'workflow.state.changed') ||
      this.configService.get<string>('WEBHOOK_URL')!;
    const authSecret = this.configService.get<string>('WEBHOOK_SECRET');

    this.logger.log('Sending webhook', { id, url });

    try {
      const res = await this.#__axios.post(
        url,
        {
          id,
          eventName: 'workflow.state.changed',
          state: data.state,
          apiVersion: 1,
          timestamp: new Date().toISOString(),
          workflowCreatedAt: data.runtimeData.createdAt,
          workflowResolvedAt: data.runtimeData.resolvedAt,
          workflowDefinitionId: data.runtimeData.workflowDefinitionId,
          workflowRuntimeId: data.runtimeData.id,
          ballerineEntityId: data.entityId,
          correlationId: data.correlationId,
          environment,
          data: data.runtimeData.context,
        },
        {
          headers: {
            'X-Authorization': authSecret,
          },
        },
      );

      this.logger.log('Webhook Result:', {
        status: res.status,
        statusText: res.statusText,
        data: res.data,
      });
    } catch (error: Error | any) {
      this.logger.log('Webhook error data::  ', {
        state: data.state,
        entityId: data.entityId,
        correlationId: data.correlationId,
        id: data.runtimeData.id,
      });
      this.logger.error('Failed to send webhook', { id, message: error?.message, error });
      alertWebhookFailure(error);
    }
  }
}
