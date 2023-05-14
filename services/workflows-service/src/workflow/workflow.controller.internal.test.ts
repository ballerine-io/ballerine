/* eslint-disable */

import { BaseFakeRepository } from '../../../../test-utils/src/base-fake-repository';

import { WorkflowControllerInternal } from './workflow.controller.internal';
import { WorkflowService } from './workflow.service';
import { WorkflowDefinitionModel } from './workflow-definition.model';
import { WorkflowEventEmitterService } from './workflow-event-emitter.service';

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
  };
}

describe('WorkflowControllerInternal', () => {
  let controller;
  let workflowRuntimeDataRepo;
  let eventEmitterSpy;
  const _ = Symbol('not in use');

  beforeEach(() => {
    const workflowDefinitionRepo = new FakeWorkflowDefinitionRepo();
    workflowRuntimeDataRepo = new FakeWorkflowRuntimeDataRepo();

    eventEmitterSpy = {
      emitted: [],

      emit(status, data) {
        this.emitted.push({ status, data });
      },
    };
    const service = new WorkflowService(
      workflowDefinitionRepo as any,
      workflowRuntimeDataRepo,
      {} as any,
      eventEmitterSpy as any,
    );

    controller = new WorkflowControllerInternal(service, {} as any);
  });

  describe('.listWorkflowDefinitions', () => {
    it('returns workflows by query', async () => {
      await controller.createWorkflowDefinition(_, buildWorkflowDeifintion(2));
      await controller.createWorkflowDefinition(_, buildWorkflowDeifintion(3));
      await controller.createWorkflowDefinition(_, buildWorkflowDeifintion(4));

      const definitions = await controller.listWorkflowDefinitions(_, {
        query: {
          where: {
            name: 'name 3',
          },
        },
      });

      expect(definitions).toHaveLength(1);
      expect(definitions[0].id).toEqual('3');
      expect(definitions[0].name).toEqual('name 3');
      expect(definitions[0]).not.toHaveProperty('updatedAt');
    });

    it('filters out certain fields', async () => {
      await controller.createWorkflowDefinition(_, buildWorkflowDeifintion(3));

      const definitions = await controller.listWorkflowDefinitions(_, {
        query: {
          where: {
            name: 'name 3',
          },
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

        await controller.createWorkflowDefinition(_, buildWorkflowDeifintion(2));
        await controller.event({ id: '2' }, { name: 'COMPLETE' });

        const runtimeData = await workflowRuntimeDataRepo.findById('2');

        expect(runtimeData.state).toEqual('completed');
        expect(runtimeData.status).toEqual('completed');
      });

      it('emits an event', async () => {
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

        await controller.createWorkflowDefinition(_, buildWorkflowDeifintion(2));
        await controller.event({ id: '2' }, { name: 'COMPLETE' });

        expect(eventEmitterSpy.emitted).toEqual([
          {
            status: 'workflow.completed',
            data: {
              // PR comment: is it really the runtimeData we intended to return?
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
