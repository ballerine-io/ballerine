/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */

import { BaseFakeRepository } from '../../../../test-utils/src/base-fake-repository';

import { WorkflowService } from './workflow.service';
import { WorkflowDefinitionModel } from './workflow-definition.model';
import { DocumentChangedWebhookCaller } from '../events/document-changed-webhook-caller';
import { Test, TestingModule } from '@nestjs/testing';
import { commonTestingModules } from '@/test/helpers/nest-app-helper';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import packageJson from '../../package.json';
import { ConfigService } from '@nestjs/config';

class FakeWorkflowRuntimeDataRepo extends BaseFakeRepository {
  constructor() {
    super(Object);
  }
}

class FakeWorkflowDefinitionRepo extends BaseFakeRepository {
  constructor() {
    super(WorkflowDefinitionModel);
  }
}

class FakeBusinessRepo extends BaseFakeRepository {
  constructor() {
    super(Object);
  }
}

class FakeEndUserRepo extends BaseFakeRepository {
  constructor() {
    super(Object);
  }
}

class FakeEntityRepo extends BaseFakeRepository {
  constructor() {
    super(Object);
  }
}

class FakeCustomerRepo extends BaseFakeRepository {
  constructor() {
    super(Object);
  }

  async getByProjectId() {
    return {
      authenticationConfiguration: {
        webhookSharedSecret: 'webhook_secret',
      },
    };
  }
}

function buildWorkflowDeifintion(sequenceNum) {
  return {
    id: sequenceNum.toString(),
    name: `name ${sequenceNum}`,
    version: sequenceNum,
    definition: {
      initial: 'initial',
      states: {
        initial: {
          on: {
            COMPLETE: 'completed',
          },
        },
        completed: {
          type: 'final',
        },
      },
    },
    definitionType: `definitionType ${sequenceNum}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    contextSchema: {
      type: 'json-schema',
      schema: {},
    },
  };
}

function buildDocument(category, status, fileType = 'jpg') {
  return {
    category: category,
    decision: {
      status: status,
    },
    pages: [
      {
        type: fileType,
      },
    ],
  };
}

describe('WorkflowService', () => {
  let service;
  let workflowRuntimeDataRepo;
  let projectScopeService;
  let businessRepo;
  let customerService;
  let endUserRepo;
  let entityRepo;
  let userService;
  let workflowTokenService;
  let salesforceService;
  const numbUserInfo = Symbol();
  let fakeHttpService;
  let testingModule: TestingModule;
  const configService = {
    WEBHOOK_URL: 'https://example.com',
    WEBHOOK_SECRET: 'webhook_secret',
    NODE_ENV: 'test',

    get(key: Exclude<keyof typeof this, 'get'>) {
      return this[key];
    },
  };

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: commonTestingModules,
    }).compile();
  });

  beforeEach(() => {
    const workflowDefinitionRepo = new FakeWorkflowDefinitionRepo();
    workflowRuntimeDataRepo = new FakeWorkflowRuntimeDataRepo();
    businessRepo = new FakeBusinessRepo();
    endUserRepo = new FakeEndUserRepo();
    entityRepo = new FakeEntityRepo();
    customerService = new FakeCustomerRepo();
    userService = new FakeEntityRepo();
    salesforceService = new FakeEntityRepo();
    workflowTokenService = new FakeEntityRepo();

    fakeHttpService = {
      requests: [],

      axiosRef: {
        async post(url, data, config) {
          fakeHttpService.requests.push({ url, data });
          return {
            status: 200,
            data: { success: true },
            statusText: 'OK',
            headers: {},
          };
        },
      },
    };

    const eventEmitter = {
      __callbacks: {},

      emit(name, args) {
        this.__callbacks[name]?.forEach(cb => cb(args));
      },

      on(name, cb) {
        this.__callbacks[name] ??= [];
        this.__callbacks[name].push(cb);
      },
    };

    const documentChangedWebhookCaller = new DocumentChangedWebhookCaller(
      fakeHttpService,
      configService as unknown as ConfigService,
      eventEmitter as any,
      testingModule.get(AppLoggerService),
      customerService,
    );

    service = new WorkflowService(
      workflowDefinitionRepo as any,
      workflowRuntimeDataRepo,
      endUserRepo,
      {} as any,
      businessRepo,
      entityRepo,
      customerService,
      {} as any,
      {} as any,
      eventEmitter as any,
      testingModule.get(AppLoggerService),
      projectScopeService,
      userService,
      salesforceService,
      workflowTokenService,
    );
  });

  describe('.listWorkflowDefinitions', () => {
    it('returns workflows by query', async () => {
      await service.createWorkflowDefinition(buildWorkflowDeifintion(2));
      await service.createWorkflowDefinition(buildWorkflowDeifintion(3));
      await service.createWorkflowDefinition(buildWorkflowDeifintion(4));

      const definitions = await service.listWorkflowDefinitions({
        where: {
          name: 'name 3',
        },
      });

      expect(definitions).toHaveLength(1);
      expect(definitions[0]).toMatchObject({ id: '3', name: 'name 3' });
    });

    it('filters out certain fields', async () => {
      await service.createWorkflowDefinition(buildWorkflowDeifintion(3));

      const definitions = await service.listWorkflowDefinitions({
        where: {
          name: 'name 3',
        },
      });

      expect(definitions[0]).not.toHaveProperty('updatedAt');
    });
  });

  describe('.event', () => {
    describe('reaching to a state of type "final"', () => {
      it('updates runtime data status to "completed"', async () => {
        const initialRuntimeData = {
          id: '2',
          workflowDefinitionId: '2',
          context: {
            numb: 'context',
          },
        };
        await workflowRuntimeDataRepo.create({
          data: initialRuntimeData,
        });

        await service.createWorkflowDefinition(buildWorkflowDeifintion(2));
        await service.event({ id: '2', name: 'COMPLETE' });

        const runtimeData = await workflowRuntimeDataRepo.findById('2');

        expect(runtimeData.state).toEqual('completed');
        expect(runtimeData.status).toEqual('completed');
      });
    });
  });

  describe('.updateWorkflowRuntimeData', () => {
    it('sends a webbhook only for changed documents', async () => {
      const initialRuntimeData = {
        id: '2',
        workflowDefinitionId: '2',
        context: {
          documents: [buildDocument('willBeRemoved', 'pending'), buildDocument('a', 'pending')],
        },
        config: {
          subscriptions: [
            {
              type: 'webhook',
              url: 'https://example.com',
              events: ['workflow.context.document.changed'],
            },
          ],
        },
      };
      await workflowRuntimeDataRepo.create({
        data: initialRuntimeData,
      });

      const newContext = {
        documents: [buildDocument('a', 'approved'), buildDocument('added', 'pending')],
      };

      await service.createWorkflowDefinition(buildWorkflowDeifintion(2));
      await service.updateWorkflowRuntimeData('2', { context: newContext });

      expect(fakeHttpService.requests).toEqual([
        {
          url: configService.get('WEBHOOK_URL'),
          data: {
            id: expect.stringMatching(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/),
            eventName: 'workflow.context.document.changed',
            workflowDefinitionId: '2',
            workflowCreatedAt: undefined,
            workflowResolvedAt: null,
            ballerineEntityId: undefined,
            correlationId: '',
            apiVersion: packageJson.version,
            timestamp: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/),
            workflowRuntimeId: '2',
            environment: 'test',
            data: {
              ...newContext,
            },
          },
        },
      ]);
    });

    it('sends a webbhook regardless regardless of case identifier case', async () => {
      const initialRuntimeData = {
        id: '2',
        workflowDefinitionId: '2',
        context: {
          documents: [buildDocument('a', 'pending')],
        },
        config: {
          subscriptions: [
            {
              type: 'webhook',
              url: 'https://example.com',
              events: ['workflow.context.document.changed'],
            },
          ],
        },
      };
      await workflowRuntimeDataRepo.create({
        data: initialRuntimeData,
      });

      const newContext = {
        documents: [buildDocument('A', 'approved')],
      };

      await service.createWorkflowDefinition(buildWorkflowDeifintion(2));
      await service.updateWorkflowRuntimeData('2', { context: newContext });

      expect(fakeHttpService.requests).toEqual([
        {
          url: configService.get('WEBHOOK_URL'),
          data: {
            id: expect.stringMatching(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/),
            eventName: 'workflow.context.document.changed',
            ballerineEntityId: undefined,
            workflowResolvedAt: null,
            workflowCreatedAt: undefined,
            correlationId: '',
            apiVersion: packageJson.version,
            timestamp: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/),
            workflowRuntimeId: '2',
            workflowDefinitionId: '2',
            environment: 'test',
            data: {
              ...newContext,
            },
          },
        },
      ]);
    });
    it('does not send a webhook if no documents have changed', async () => {
      const initialRuntimeData = {
        id: '2',
        workflowDefinitionId: '2',
        context: {
          documents: [
            buildDocument('willBeRemoved', 'pending'),
            buildDocument('a', 'pending'),
            buildDocument('b', 'pending'),
          ],
        },
        config: {
          subscriptions: [
            {
              type: 'webhook',
              url: 'https://example.com',
              events: ['workflow.context.document.changed'],
            },
          ],
        },
      };
      await workflowRuntimeDataRepo.create({
        data: initialRuntimeData,
      });

      await service.createWorkflowDefinition(buildWorkflowDeifintion(2));
      await service.updateWorkflowRuntimeData('2', {
        context: {
          documents: [
            buildDocument('added', 'pending'),
            buildDocument('a', 'pending'),
            buildDocument('b', 'pending'),
          ],
        },
      });

      expect(fakeHttpService.requests).toEqual([]);
    });
  });
});
