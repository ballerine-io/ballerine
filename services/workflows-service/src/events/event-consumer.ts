/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { WorkflowEventRawData } from '@/workflow/workflow-event-emitter.service';
import { Injectable } from '@nestjs/common';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { ListenerFn } from './types';
import axios from 'axios';
import { randomUUID } from 'crypto';

@Injectable()
export class EventConsumerListener {
  constructor(private eventEmitter: EventEmitter2) {}

  @OnEvent('workflow.context.changed')
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
    const url = process.env.WEBHOOK_URL as string;
    const environment = process.env.NODE_ENV;
    const authSecret = process.env.WEBHOOK_SECRET as string;

    if (anyDocumentStatusChanged) {
      console.log(`sending request id: ${id}`);

      axios
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
            auth: {
              username: 'TBD',
              password: authSecret,
            },
          },
        )
        .catch(err => {
          console.log(`failed to send request id: ${id}`, err);
        });
    }
  }
}
