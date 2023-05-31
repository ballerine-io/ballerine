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

    workflowEventEmitter.on('workflow.context.changed', data => {
      void this.handleWorkflowEvent(data);
    });
  }

  async handleWorkflowEvent(data: WorkflowEventRawData) {
    const oldDocuments = data.runtimeData.context['documents'] || [];
    const newDocuments = data.context?.['documents'] || [];

    const documentIdentifier = (doc: any) => {
      return `${doc.category as string}$${doc.type as string}$${
        doc.issuer?.country as string
      }`.toLowerCase();
    };

    const newDocumentsByIdentifier = newDocuments.reduce((accumulator: any, doc: any) => {
      const id = documentIdentifier(doc);
      accumulator[id] = doc;
      return accumulator;
    }, {});

    const anyDocumentStatusChanged = (oldDocuments as Array<any>).some(oldDocument => {
      const id = documentIdentifier(oldDocument);
      return (
        oldDocument.decision &&
        oldDocument.decision.status &&
        id in newDocumentsByIdentifier &&
        oldDocument.decision.status !== newDocumentsByIdentifier[id].decision.status
      );
    });

    if (!anyDocumentStatusChanged) {
      return;
    }

    const id = randomUUID();
    const environment = this.configService.get<string>('NODE_ENV');
    const url = this.configService.get<string>('WEBHOOK_URL')!;
    const authSecret = this.configService.get<string>('WEBHOOK_SECRET');

    this.logger.log('Sending webhook', { id });

    try {
      await this.#__axios.post(
        url,
        {
          id,
          eventName: 'workflow.context.document.changed',
          apiVersion: 1,
          timestamp: new Date().toISOString(),
          workflowRuntimeId: data.runtimeData.id,
          environment,
          data: data.context,
        },
        {
          headers: {
            'X-Authorization': authSecret,
          },
        },
      );
    } catch (error) {
      this.logger.error('Failed to send webhook', { id, error });
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
