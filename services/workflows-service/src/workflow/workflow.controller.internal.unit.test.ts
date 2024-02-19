import { BaseFakeRepository } from '../../../../test-utils/src/base-fake-repository';
import { WorkflowControllerInternal } from './workflow.controller.internal';
import { WorkflowService } from './workflow.service';
import { WorkflowDefinitionModel } from './workflow-definition.model';
import { EndUserModel } from '@/end-user/end-user.model';
import { BusinessModel } from '@/business/business.model';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { commonTestingModules } from '@/test/helpers/nest-app-helper';
import { Test, TestingModule } from '@nestjs/testing';

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
    super(BusinessModel);
  }
}

class FakeEndUserRepo extends BaseFakeRepository {
  constructor() {
    super(EndUserModel);
  }
}

class FakeEntityRepo extends BaseFakeRepository {
  constructor() {
    super(Object);
  }
}

class FakeUiDefinitionService extends BaseFakeRepository {
  constructor() {
    super(Object);
  }
}

export const buildWorkflowDefinition = (sequenceNum: number, projectId?: string) => {
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
    projectId: projectId,
    isPublic: false,
  };
};

describe('WorkflowControllerInternal', () => {
  let controller;
  let workflowRuntimeDataRepo;
  let businessRepo;
  let endUserRepo;
  let entityRepo;
  let eventEmitterSpy;
  let customerService;
  let scopeService;
  let userService;
  let salesforceService;
  let workflowTokenService;
  let uiDefinitionService;
  const numbUserInfo = Symbol();
  let testingModule: TestingModule;

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
    scopeService = new FakeEntityRepo();
    customerService = new FakeEntityRepo();
    userService = new FakeEntityRepo();
    salesforceService = new FakeEntityRepo();
    workflowTokenService = new FakeEntityRepo();
    uiDefinitionService = new FakeUiDefinitionService();

    eventEmitterSpy = {
      emitted: [],

      emit(status, data) {
        this.emitted.push({ status, data });
      },
    };
    const service = new WorkflowService(
      workflowDefinitionRepo as any,
      workflowRuntimeDataRepo,
      endUserRepo,
      {} as any,
      businessRepo,
      entityRepo,
      customerService,
      {} as any,
      eventEmitterSpy,
      testingModule.get(AppLoggerService),
      scopeService,
      userService,
      salesforceService,
      workflowTokenService,
      uiDefinitionService,
    );
    const filterService = {} as any;
    const rolesBuilder = {} as any;

    controller = new WorkflowControllerInternal(service, filterService, rolesBuilder, scopeService);
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

        await controller.createWorkflowDefinition(buildWorkflowDefinition(2));
        await controller.event({ id: '2' }, { name: 'COMPLETE' });

        const runtimeData = await workflowRuntimeDataRepo.findById('2');

        expect(runtimeData.state).toEqual('completed');
        expect(runtimeData.status).toEqual('completed');
      });

      it.skip('emits an event', async () => {
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

        await controller.createWorkflowDefinition(numbUserInfo, buildWorkflowDefinition(2));
        await controller.event({ id: '2' }, { name: 'COMPLETE' });

        expect(eventEmitterSpy.emitted).toEqual([
          {
            status: 'workflow.completed',
            data: {
              runtimeData: initialRuntimeData,
              state: 'completed',
              context: {
                numb: 'context',
              },
            },
          },
        ]);
      });
    });
  });
});
