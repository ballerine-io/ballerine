/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { WorkflowEventRawData } from '@/workflow/workflow-event-emitter.service';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID } from 'crypto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EventConsumerListener {
  #__axios: any;

  constructor(
    private httpService: HttpService,
    private eventEmitter: EventEmitter2,
    private configService: ConfigService,
  ) {
    this.#__axios = this.httpService.axiosRef;

    eventEmitter.on('workflow.context.changed', this.handleWorkflowEvent.bind(this));
  }

  handleWorkflowEvent(data: WorkflowEventRawData) {
    const oldDocuments = data.runtimeData.context['documents'] || [];
    const newDocuments = data.context?.['documents'] || [];

    const documentIdentifier = (doc: any) => {
      return `${doc.category as string}$${doc.type as string}$${doc.issuer?.country as string}`;
    };

    const newDocumentsByIdentifier = newDocuments.reduce((accumulator: any, doc: any) => {
      const id = documentIdentifier(doc);
      accumulator[id] = doc;
      return accumulator;
    }, {});

    const anyDocumentStatusChanged = (oldDocuments as Array<any>).some(oldDocument => {
      const id = documentIdentifier(oldDocument);
      return (
        id in newDocumentsByIdentifier &&
        oldDocument.decision.status !== newDocumentsByIdentifier[id].decision.status
      );
    });

    const id = randomUUID();
    const environment = this.configService.get<string>('NODE_ENV');
    const url = this.configService.get<string>('WEBHOOK_URL');
    const authSecret = this.configService.get<string>('WEBHOOK_SECRET');

    if (anyDocumentStatusChanged) {
      console.log(`sending request id: ${id}`);

      this.#__axios
        .post(
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
        )
        .catch((err: Error) => {
          console.log(`failed to send request id: ${id}`, err);
        });
    }
  }
}
