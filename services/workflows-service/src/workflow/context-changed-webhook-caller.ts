/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { randomUUID } from 'crypto';
import { sortBy } from 'lodash';

export class ContextChangedWebookCaller {
  #__webhookConfig: ProcessEnvWebhookConfig;
  #__httpService;
  #__documentIdentifier;

  constructor(eventEmitter: any, webhookConfig: any, httpService: any, documentIdentifier: any) {
    this.#__webhookConfig = webhookConfig;
    this.#__httpService = httpService;
    this.#__documentIdentifier = documentIdentifier;

    eventEmitter.subscribe('workflow.context.changed', this.callWebhook.bind(this));
  }

  callWebhook(data: any) {
    const { runtimeData, state, newContext, ..._ } = data;

    const oldDocuments = runtimeData.context['documents'] || [];
    const newDocuments = newContext['documents'] || [];

    const newDocumentsByIdentifier = newDocuments.reduce((accumulator, doc) => {
      const id = this.#__documentIdentifier(doc);
      accumulator[id] = doc;
      return accumulator;
    }, {});

    const anyDocumentStatusChanged = (oldDocuments as Array<any>).some(oldDocument => {
      const id = this.#__documentIdentifier(oldDocument);
      return (
        id in newDocumentsByIdentifier &&
        oldDocument.decision.status !== newDocumentsByIdentifier[id].decision.status
      );
    });

    const id = randomUUID();

    if (anyDocumentStatusChanged) {
      setTimeout(() => {
        this.#__httpService.post(this.#__webhookConfig.url, {
          id,
          eventName: 'workflow.context.document.changed',
          apiVersion: 1,
          timestamp: new Date().toISOString(),
          workflowRuntimeId: runtimeData.id,
          environment: this.#__webhookConfig.environment,
          data: newContext,
        });
      });
    }
  }
}

export class ProcessEnvWebhookConfig {
  #__processEnv;

  constructor(processEnv: any) {
    this.#__processEnv = processEnv || process.env;
  }

  get url() {
    return this.#__processEnv.WEBHOOK_URL;
  }

  get environment() {
    return this.#__processEnv.NODE_ENV;
  }
}
