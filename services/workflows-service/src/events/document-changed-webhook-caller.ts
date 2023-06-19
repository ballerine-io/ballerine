/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import {
  WorkflowEventEmitterService,
  WorkflowEventRawData,
} from '@/workflow/workflow-event-emitter.service';
import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import { AxiosInstance, isAxiosError } from 'axios';
import { WorkflowConfig } from '@/workflow/schemas/zod-schemas';
import { getDocumentId } from '@ballerine/common';

@Injectable()
export class DocumentChangedWebhookCaller {
  private readonly logger = new Logger(DocumentChangedWebhookCaller.name);

  #__axios: AxiosInstance;

  constructor(
    private httpService: HttpService,
    private workflowEventEmitter: WorkflowEventEmitterService,
    private configService: ConfigService,
  ) {
    this.#__axios = this.httpService.axiosRef;

    workflowEventEmitter.on('workflow.context.changed', async data => {
      try {
        await this.handleWorkflowEvent(data);
      } catch (error) {
        console.error(error);
        alertWebhookFailure(error);
      }
    });
  }

  async handleWorkflowEvent(data: WorkflowEventRawData) {
    const oldDocuments = data.runtimeData.context['documents'] || [];
    const newDocuments = data.context?.['documents'] || [];

    const newDocumentsByIdentifier = newDocuments.reduce((accumulator: any, doc: any) => {
      const id = getDocumentId(doc, false);
      accumulator[id] = doc;
      return accumulator;
    }, {});

    const anyDocumentStatusChanged = oldDocuments.some((oldDocument: any) => {
      const id = getDocumentId(oldDocument, false);

      return (
        (!oldDocument.decision && newDocumentsByIdentifier[id].decision) ||
        (oldDocument.decision &&
          oldDocument.decision.status &&
          id in newDocumentsByIdentifier &&
          oldDocument.decision.status !== newDocumentsByIdentifier[id].decision?.status)
      );
    });

    if (!anyDocumentStatusChanged) {
      return;
    }

    const id = randomUUID();
    const environment = this.configService.get<string>('NODE_ENV');
    const url =
      getDynamicWebhookUrl(data.runtimeData?.config) ||
      this.configService.get<string>('WEBHOOK_URL')!;
    const authSecret = this.configService.get<string>('WEBHOOK_SECRET');

    data.context.documents.forEach((doc: any) => {
      delete doc.propertiesSchema;
    });

    this.logger.log('Sending webhook', { id, url });

    try {
      const res = await this.#__axios.post(
        url,
        {
          id,
          eventName: 'workflow.context.document.changed',
          apiVersion: 1,
          timestamp: new Date().toISOString(),
          workflowDefinitionId: data.runtimeData.workflowDefinitionId,
          workflowRuntimeId: data.runtimeData.id,
          ballerineEntityId: data.entityId,
          correlationId: data.correlationId,
          environment,
          data: data.context,
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
      this.logger.error('Failed to send webhook', { id, message: error?.message, error });
      alertWebhookFailure(error);
    }
  }
}

function alertWebhookFailure(error: unknown) {
  const errorToAlert = new Error(`Failed to send a webhook`, { cause: error });
  const context = isAxiosError(error) ? { ...error } : {};

  Sentry.captureException(errorToAlert, {
    extra: context,
  });
}

const getDynamicWebhookUrl = (config: WorkflowConfig) => {
  if (!config || !config.subscriptions) return;

  const subscription = config.subscriptions.find(sub =>
    sub.events.includes('workflow.context.document.changed'),
  );

  if (!subscription || subscription.type !== 'webhook') return;

  return subscription.url;
};
