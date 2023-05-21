/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { BaseFakeRepository } from '../../../../test-utils/src/base-fake-repository';

import { WorkflowService } from './workflow.service';
import { WorkflowDefinitionModel } from './workflow-definition.model';

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
    contextSchema: {
      type: 'json-schema',
      schema: {},
    },
  };
}

describe('WorkflowService', () => {
  let service;
  let workflowRuntimeDataRepo;
  const numbUserInfo = Symbol();
  let fakeHttpService;
  let eventEmitter;

  beforeEach(() => {
    const workflowDefinitionRepo = new FakeWorkflowDefinitionRepo();
    workflowRuntimeDataRepo = new FakeWorkflowRuntimeDataRepo();

    eventEmitter = {
      emitted: Array<any>(),

      emit(name, args) {
        this.emitted.push(args);
      },
    };

    service = new WorkflowService(
      workflowDefinitionRepo as any,
      workflowRuntimeDataRepo,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      eventEmitter as any,
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
    it('emits an event when context has changed', async () => {
      const initialRuntimeData = {
        id: '2',
        workflowDefinitionId: '2',
        context: {
          documents: [
            {
              testId: 1,
              decision: {
                status: 'undecided',
              },
            },
            {
              testId: 2,
              decision: {
                status: 'undecided',
              },
            },
          ],
        },
      };
      await workflowRuntimeDataRepo.create({
        data: initialRuntimeData,
      });

      const newContext = {
        documents: [
          {
            testId: 2,
            decision: {
              status: 'decided',
            },
            propertiesSchema: {},
          },
          {
            testId: 3,
            decision: {
              status: 'undecided',
            },
            propertiesSchema: {},
          },
        ],
      };

      await service.createWorkflowDefinition(buildWorkflowDeifintion(2));
      await service.updateWorkflowRuntimeData('2', { context: newContext });

      expect(eventEmitter.emitted).toEqual([
        {
          context: newContext,
          runtimeData: initialRuntimeData,
          state: undefined,
        },
      ]);
    });

    it('does not emit an event when context has changed', async () => {
      const initialRuntimeData = {
        id: '2',
        workflowDefinitionId: '2',
        context: {
          documents: [
            {
              testId: 1,
              decision: {
                status: 'undecided',
              },
              propertiesSchema: {},
            },
            {
              testId: 2,
              decision: {
                status: 'undecided',
              },
              propertiesSchema: {},
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
            {
              testId: 1,
              decision: {
                status: 'undecided',
              },
              propertiesSchema: {},
            },
            {
              testId: 2,
              decision: {
                status: 'undecided',
              },
              propertiesSchema: {},
            },
          ],
        },
      });

      expect(eventEmitter.emitted).toEqual([]);
    });
  });
});
