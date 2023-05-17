/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { randomUUID } from 'crypto';

export class ContextChangedWebookCaller {
  #__webhookConfig: ProcessEnvWebhookConfig;
  #__httpService;

  constructor(eventEmitter: any, webhookConfig: any, httpService: any) {
    this.#__webhookConfig = webhookConfig;
    this.#__httpService = httpService;

    eventEmitter.subscribe('workflow.context.changed', this.callWebhook.bind(this));
  }

  callWebhook(data: any) {
    const { runtimeData, state, newContext, ..._ } = data;

    const oldDocuments = runtimeData.context['documents'] || [];
    const newDocuments = newContext['documents'] || [];

    const anyDocumentStatusChanged = (oldDocuments as Array<any>).some(
      (oldDocument, i) => oldDocument.decision.status !== newDocuments[i].decision.status,
    );

    const id = randomUUID();

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
