import { BaseFakeRepository } from '../../../../test-utils/src/base-fake-repository';
import { WorkflowService } from './workflow.service';
import { DocumentChangedWebhookCaller } from '../events/document-changed-webhook-caller';
import { Test, TestingModule } from '@nestjs/testing';
import { commonTestingModules } from '@/test/helpers/nest-app-helper';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { ConfigService } from '@nestjs/config';

class FakeWorkflowRuntimeDataRepo extends BaseFakeRepository {
  constructor() {
    super(Object);
  }
}

class FakeWorkflowDefinitionRepo extends BaseFakeRepository {
  constructor() {
    super(Object);
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

class FakeUiDefinitionService extends BaseFakeRepository {
  constructor() {
    super(Object);
  }
}

const buildWorkflowDeifintion = (sequenceNum: number) => {
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
};

const buildDocument = (category: string, status: string, fileType = 'jpg') => ({
  category: category,
  decision: {
    status: status,
  },
  pages: [
    {
      type: fileType,
    },
  ],
});

describe('WorkflowService', () => {
  let service;
  let workflowRuntimeDataRepo;
  let projectScopeService;
  let businessRepo;
  let businessService;
  let customerService;
  let endUserRepo;
  let entityRepo;
  let userService;
  let workflowTokenService;
  let uiDefinitionService;
  let salesforceService;
  let fakeHttpService;
  let testingModule: TestingModule;
  const configService = {
    WEBHOOK_URL: 'https://example.com',
    WEBHOOK_SECRET: 'webhook_secret',
    NODE_ENV: 'test',
    ENVIRONMENT_NAME: 'test',

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
    businessService = new FakeBusinessRepo();
    endUserRepo = new FakeEndUserRepo();
    entityRepo = new FakeEntityRepo();
    customerService = new FakeCustomerRepo();
    userService = new FakeEntityRepo();
    salesforceService = new FakeEntityRepo();
    workflowTokenService = new FakeEntityRepo();
    uiDefinitionService = new FakeUiDefinitionService();

    fakeHttpService = {
      requests: [],

      axiosRef: {
        post: async (url, data, config) => {
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
      businessService,
      entityRepo,
      customerService,
      {} as any,
      eventEmitter as any,
      testingModule.get(AppLoggerService),
      projectScopeService,
      userService,
      salesforceService,
      workflowTokenService,
      uiDefinitionService,
      {} as any,
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
});
