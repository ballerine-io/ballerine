import {
  EventConfig,
  WorkflowEventEmitterService,
} from '@/workflow/workflow-event-emitter.service';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosInstance } from 'axios';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { DefaultContextSchema, getDocumentId } from '@ballerine/common';
import { alertWebhookFailure } from '@/events/alert-webhook-failure';
import { ExtractWorkflowEventData } from '@/workflow/types';
import { getWebhooks, Webhook } from '@/events/get-webhooks';
import { ConfigService } from '@nestjs/config';
import type { TAuthenticationConfiguration } from '@/customer/types';
import { CustomerService } from '@/customer/customer.service';
import { env } from '@/env';
import { sign } from '@/common/utils/sign/sign';

const getExtensionFromMimeType = (mimeType: string) => {
  const parts = mimeType?.split('/');

  if (parts?.length === 2) {
    return parts[1];
  }

  return mimeType;
};

@Injectable()
export class DocumentChangedWebhookCaller {
  #__axios: AxiosInstance;

  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
    workflowEventEmitter: WorkflowEventEmitterService,
    private readonly logger: AppLoggerService,
    private readonly customerService: CustomerService,
  ) {
    this.#__axios = this.httpService.axiosRef;

    workflowEventEmitter.on(
      'workflow.context.changed',
      async (data: ExtractWorkflowEventData<'workflow.context.changed'>, config) => {
        try {
          await this.handleWorkflowEvent(data, config);
        } catch (error) {
          this.logger.error('workflowEventEmitter::workflow.context.changed::', {
            correlationId: data.correlationId,
            error,
          });
          alertWebhookFailure(error);
        }
      },
    );
  }

  async handleWorkflowEvent(
    data: ExtractWorkflowEventData<'workflow.context.changed'>,
    config: EventConfig = {},
  ) {
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

    const anyDocumentStatusChanged =
      oldDocuments.some((oldDocument: any) => {
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
      }) || config.forceEmit;

    if (!anyDocumentStatusChanged) {
      this.logger.log('handleWorkflowEvent:: Skipped, ', {
        anyDocumentStatusChanged,
      });

      return;
    }

    const webhooks = getWebhooks(
      data.updatedRuntimeData.config,
      this.configService.get('ENVIRONMENT_NAME'),
      'workflow.context.document.changed',
    );

    data.updatedRuntimeData.context.documents.forEach((doc: any) => {
      delete doc.propertiesSchema;

      doc.pages.forEach((page: DefaultContextSchema['documents'][number]['pages'][number]) => {
        if (!page?.type) {
          this.logger.warn('No document page type found', {
            workflowRuntimeDataId: data.updatedRuntimeData.id,
            document: doc,
          });

          return;
        }

        const formattedType = getExtensionFromMimeType(page.type)?.replace('jpeg', 'jpg');

        if (!formattedType) {
          this.logger.warn('No formatted document page type found', {
            workflowRuntimeDataId: data.updatedRuntimeData.id,
            document: doc,
          });

          return;
        }

        // fix type
        // delete mime from mime type and rename jpeg to jpg / should be removed after deprecation period (BAL-703)
        page.type = formattedType;
      });
    });

    const customer = await this.customerService.getByProjectId(data.updatedRuntimeData.projectId, {
      select: {
        authenticationConfiguration: true,
      },
    });

    const { webhookSharedSecret } =
      customer.authenticationConfiguration as TAuthenticationConfiguration;

    for (const webhook of webhooks) {
      await this.sendWebhook({
        data,
        newDocumentsByIdentifier,
        oldDocuments,
        webhook,
        webhookSharedSecret,
      });
    }
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
        assignee: data.assignee
          ? {
              id: data.assignee.id,
              firstName: data.assignee.firstName,
              lastName: data.assignee.lastName,
              email: data.assignee.email,
            }
          : null,
        assignedAt: data.assignedAt,
        workflowCreatedAt: data.updatedRuntimeData.createdAt,
        workflowResolvedAt: data.updatedRuntimeData.resolvedAt,
        workflowDefinitionId: data.updatedRuntimeData.workflowDefinitionId,
        workflowRuntimeId: data.updatedRuntimeData.id,
        ballerineEntityId: data.entityId,
        correlationId: data.correlationId,
        environment,
        data: data.updatedRuntimeData.context,
      };

      const res = await this.#__axios.post(url, payload, {
        headers: {
          'X-Authorization': env.WEBHOOK_SECRET,
          'X-HMAC-Signature': sign({ payload, key: webhookSharedSecret }),
        },
      });

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
