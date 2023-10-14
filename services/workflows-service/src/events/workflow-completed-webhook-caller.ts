/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosInstance } from 'axios';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { alertWebhookFailure } from '@/events/alert-webhook-failure';
import { ExtractWorkflowEventData } from '@/workflow/types';
import { getWebhookInfo } from '@/events/get-webhook-info';
import { IWebhookPayload } from '@/events/types';
import { WorkflowService } from '@/workflow/workflow.service';
import { WorkflowRuntimeData } from '@prisma/client';
import { StateTag } from '@ballerine/common';

@Injectable()
export class WorkflowCompletedWebhookCaller {
  #__axios: AxiosInstance;

  constructor(
    private httpService: HttpService,
    private workflowEventEmitter: WorkflowEventEmitterService,
    private configService: ConfigService,
    private readonly logger: AppLoggerService,
    private readonly workflowService: WorkflowService,
  ) {
    this.#__axios = this.httpService.axiosRef;

    workflowEventEmitter.on('workflow.completed', async data => {
      try {
        await this.handleWorkflowEvent(data);
      } catch (error) {
        console.error(error);
        alertWebhookFailure(error);
      }

      await this.updateSalesforceRecord(data.runtimeData);
    });
  }

  async handleWorkflowEvent(data: ExtractWorkflowEventData<'workflow.completed'>) {
    this.logger.log('handleWorkflowEvent:: ', {
      state: data.state,
      entityId: data.entityId,
      correlationId: data.correlationId,
      id: data.runtimeData.id,
    });

    const { id, environment, url, authSecret, apiVersion } = getWebhookInfo(
      data.runtimeData.config,
      this.configService.get('NODE_ENV'),
      this.configService.get('WEBHOOK_URL'),
      this.configService.get('WEBHOOK_SECRET'),
      'workflow.completed',
    );

    if (!url) {
      this.logger.log(`No webhook url found for a workflow runtime data with an id of "${id}"`);
      return;
    }

    this.logger.log('Sending webhook', { id, url });

    try {
      // Omit from data properties already sent as part of the webhook payload
      const { runtimeData, correlationId, entityId, ...restData } = data;
      const {
        createdAt,
        resolvedAt,
        workflowDefinitionId,
        id: runtimeDataId,
        ...restRuntimeData
      } = runtimeData;
      const res = await this.#__send(
        {
          url,
          authSecret,
        },
        {
          id,
          eventName: 'workflow.completed',
          apiVersion,
          timestamp: new Date().toISOString(),
          workflowCreatedAt: createdAt,
          workflowResolvedAt: resolvedAt,
          workflowDefinitionId,
          workflowRuntimeId: runtimeDataId,
          workflowStatus: data.runtimeData.status,
          workflowFinalState: data.runtimeData.state,
          ballerineEntityId: entityId,
          correlationId,
          environment,
          data: {
            ...restRuntimeData.context,
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

  #__send(
    options: {
      url: string;
      authSecret: string | undefined;
    },
    data: IWebhookPayload,
  ) {
    return this.#__axios.post(options.url, data, {
      headers: {
        'X-Authorization': options.authSecret,
      },
    });
  }

  private async updateSalesforceRecord(workflowRuntimeData: WorkflowRuntimeData) {
    const { salesforceRecordId, salesforceObjectName } = workflowRuntimeData;

    if (!salesforceRecordId || !salesforceObjectName) {
      return;
    }

    const statusMap = {
      [StateTag.APPROVED]: 'Approved',
      [StateTag.REJECTED]: 'Rejected',
    } as const;

    let status: (typeof statusMap)[keyof typeof statusMap] | undefined;

    workflowRuntimeData.tags?.some((tag: string) => {
      if (tag in statusMap) {
        status = statusMap[tag as keyof typeof statusMap];

        return true;
      }
    });

    if (!status) {
      return;
    }

    await this.workflowService.updateSalesforceRecord({
      workflowRuntimeData,
      data: {
        KYB_Status__c: status,
      },
    });
  }
}
