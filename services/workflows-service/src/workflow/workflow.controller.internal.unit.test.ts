/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { BaseFakeRepository } from '../../../../test-utils/src/base-fake-repository';

import { WorkflowControllerInternal } from './workflow.controller.internal';
import { WorkflowService } from './workflow.service';
import { WorkflowDefinitionModel } from './workflow-definition.model';
import { EndUserModel } from '@/end-user/end-user.model';
import { BusinessModel } from '@/business/business.model';

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

describe('WorkflowControllerInternal', () => {
  let controller;
  let workflowRuntimeDataRepo;
  let businessRepo;
  let endUserRepo;
  let eventEmitterSpy;
  const numbUserInfo = Symbol();

  beforeEach(() => {
    const workflowDefinitionRepo = new FakeWorkflowDefinitionRepo();
    workflowRuntimeDataRepo = new FakeWorkflowRuntimeDataRepo();
    businessRepo = new FakeBusinessRepo();
    endUserRepo = new FakeEndUserRepo();

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
      businessRepo,
      {} as any,
      {} as any,
      eventEmitterSpy,
    );
    const filterService = {} as any;
    const rolesBuilder = {} as any;

    controller = new WorkflowControllerInternal(service, filterService, rolesBuilder);
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

        await controller.createWorkflowDefinition(numbUserInfo, buildWorkflowDeifintion(2));
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

        await controller.createWorkflowDefinition(numbUserInfo, buildWorkflowDeifintion(2));
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
