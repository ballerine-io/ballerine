/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosInstance } from 'axios';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { getDocumentId } from '@ballerine/common';
import { alertWebhookFailure } from '@/events/alert-webhook-failure';
import { ExtractWorkflowEventData } from '@/workflow/types';
import { getWebhookInfo } from '@/events/get-webhook-info';

@Injectable()
export class DocumentChangedWebhookCaller {
  #__axios: AxiosInstance;

  constructor(
    private httpService: HttpService,
    private workflowEventEmitter: WorkflowEventEmitterService,
    private configService: ConfigService,
    private readonly logger: AppLoggerService,
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

  async handleWorkflowEvent(data: ExtractWorkflowEventData<'workflow.context.changed'>) {
    const oldDocuments = data.oldRuntimeData.context['documents'] || [];
    const newDocuments = data.updatedRuntimeData.context?.['documents'] || [];

    this.logger.log('handleWorkflowEvent:: ', {
      state: data.state,
      entityId: data.entityId,
      correlationId: data.correlationId,
      id: data.updatedRuntimeData.id,
    });

    const newDocumentsByIdentifier = newDocuments.reduce((accumulator: any, doc: any) => {
      const id = getDocumentId(doc, false);
      this.logger.log('handleWorkflowEvent::newDocumentsByIdentifier::getDocumentId::  ', {
        idDoc: id,
      });
      accumulator[id] = doc;
      return accumulator;
    }, {});

    const anyDocumentStatusChanged = oldDocuments.some((oldDocument: any) => {
      const id = getDocumentId(oldDocument, false);
      this.logger.log('handleWorkflowEvent::anyDocumentStatusChanged::getDocumentId::  ', {
        idDoc: id,
      });
      return (
        (!oldDocument.decision && newDocumentsByIdentifier[id]?.decision) ||
        (oldDocument.decision &&
          oldDocument.decision.status &&
          id in newDocumentsByIdentifier &&
          oldDocument.decision.status !== newDocumentsByIdentifier[id].decision?.status)
      );
    });

    if (!anyDocumentStatusChanged) {
      this.logger.log('handleWorkflowEvent:: Skipped, ', {
        anyDocumentStatusChanged,
      });
      return;
    }

    const { id, environment, url, authSecret } = getWebhookInfo(data.updatedRuntimeData.config);

    data.updatedRuntimeData.context.documents.forEach((doc: any) => {
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
          workflowCreatedAt: data.updatedRuntimeData.createdAt,
          workflowResolvedAt: data.updatedRuntimeData.resolvedAt,
          workflowDefinitionId: data.updatedRuntimeData.workflowDefinitionId,
          workflowRuntimeId: data.updatedRuntimeData.id,
          ballerineEntityId: data.entityId,
          correlationId: data.correlationId,
          environment,
          data: data.updatedRuntimeData.context,
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
        id: data.updatedRuntimeData.id,
        newDocumentsByIdentifier,
        oldDocuments,
      });
      this.logger.error('Failed to send webhook', { id, message: error?.message, error });
      alertWebhookFailure(error);
    }
  }
}
