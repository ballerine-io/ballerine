/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { BaseFakeRepository } from '../../../../test-utils/src/base-fake-repository';

import { WorkflowService } from './workflow.service';
import { WorkflowDefinitionModel } from './workflow-definition.model';
import { EventEmitter } from './event-emitter';
import {
  ContextChangedWebookCaller,
  ProcessEnvWebhookConfig,
} from './context-changed-webhook-caller';

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

const sleep = ms => new Promise(r => setTimeout(r, ms));

describe('WorkflowService', () => {
  let service;
  let workflowRuntimeDataRepo;
  const numbUserInfo = Symbol();
  let fakeHttpService;

  beforeEach(() => {
    const workflowDefinitionRepo = new FakeWorkflowDefinitionRepo();
    workflowRuntimeDataRepo = new FakeWorkflowRuntimeDataRepo();

    const webhookConfig = new ProcessEnvWebhookConfig({
      WEBHOOK_URL: 'example.com',
      NODE_ENV: 'some_node_env',
    });

    fakeHttpService = {
      requests: Array<any>(),

      post(url, data) {
        this.requests.push({ url, data });
      },
    };

    const eventEmitter = new EventEmitter();
    const documentIdentifier = doc => doc.testId;
    const contextChangedWebhookCaller = new ContextChangedWebookCaller(
      eventEmitter,
      webhookConfig,
      fakeHttpService,
      documentIdentifier,
    );

    service = new WorkflowService(
      workflowDefinitionRepo as any,
      workflowRuntimeDataRepo,
      {} as any,
      {} as any,
      eventEmitter,
      webhookConfig,
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
    it('sends a non blocking webhook when decision has changed', async () => {
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

      await service.createWorkflowDefinition(buildWorkflowDeifintion(2));
      await service.updateWorkflowRuntimeData('2', {
        context: {
          documents: [
            {
              testId: 2,
              decision: {
                status: 'decided',
              },
            },
            {
              testId: 3,
              decision: {
                status: 'undecided',
              },
            },
          ],
        },
      });

      expect(fakeHttpService.requests).toEqual([]);
      await sleep(1);
      expect(fakeHttpService.requests).toEqual([
        {
          url: 'example.com',
          data: {
            id: expect.stringMatching(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/),
            eventName: 'workflow.context.document.changed',
            apiVersion: 1,
            timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d*Z$/),
            workflowRuntimeId: '2',
            environment: 'some_node_env',
            data: {
              documents: [
                {
                  testId: 2,
                  decision: {
                    status: 'decided',
                  },
                },
                {
                  testId: 3,
                  decision: {
                    status: 'undecided',
                  },
                },
              ],
            },
          },
        },
      ]);
    });

    it('does not send webhook when decision has not changed', async () => {
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

      await service.createWorkflowDefinition(buildWorkflowDeifintion(2));
      await service.updateWorkflowRuntimeData('2', {
        context: {
          documents: [
            {
              testId: 2,
              decision: {
                status: 'undecided',
              },
            },
            {
              testId: 3,
              decision: {
                status: 'decided',
              },
            },
          ],
        },
      });

      await sleep(1);
      expect(fakeHttpService.requests).toEqual([]);
    });
  });
});
