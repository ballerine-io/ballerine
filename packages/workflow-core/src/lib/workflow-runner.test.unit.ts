import { describe, expect, it, vi } from 'vitest';
import { createWorkflow } from './create-workflow';
import nock from 'nock';
import { WorkflowRunner } from './workflow-runner';
import { ApiPlugin } from './plugins';
import { JmespathTransformer } from './utils';
import { ChildWorkflowPlugin } from './plugins/common-plugin/child-workflow-plugin';

const generateWorkflow = (options?: Partial<Parameters<typeof createWorkflow>[0]>) => {
  return createWorkflow({
    ...options,
    runtimeId: 'test',
    definitionType: 'statechart-json',
    definition: {
      initial: 'first',
      states: {
        first: {
          on: {
            NEXT: 'second',
          },
        },
        second: {
          on: {
            NEXT: 'third',
          },
        },
        third: {
          on: {
            NEXT: 'fourth',
          },
        },
        fourth: {},
      },
      ...options?.definition,
    },
    workflowContext: {
      machineContext: {},
      ...options?.workflowContext,
    },
  }) as WorkflowRunner;
};

describe('sendEvent #unit', () => {
  describe('when firing a valid event', () => {
    it('should move the workflow to the next state', async () => {
      // Arrange
      const workflow = generateWorkflow();
      const payload = {
        type: 'NEXT',
      } satisfies Parameters<(typeof workflow)['sendEvent']>[0];

      // Act
      await workflow.sendEvent(payload);

      // Assert
      const state = workflow.getSnapshot().value;

      expect(state).toBe('second');
    });

    it('should execute pre-plugins', async () => {
      // Arrange
      const action = vi.fn();
      const workflow = generateWorkflow({
        extensions: {
          statePlugins: [
            {
              name: 'test',
              when: 'pre',
              stateNames: ['second'],
              isBlocking: true,
              action,
            },
          ],
        },
      });
      const payload = {
        type: 'NEXT',
      } satisfies Parameters<(typeof workflow)['sendEvent']>[0];

      // Act
      await workflow.sendEvent(payload);
      await workflow.sendEvent(payload);

      // Assert
      expect(action).toHaveBeenCalledTimes(1);
      action.mockClear();
    });

    it('should execute API plugins', async () => {
      // Arrange
      const workflow = generateWorkflow({
        extensions: {
          apiPlugins: [
            {
              name: 'test',
              stateNames: ['second'],
              method: 'GET',
              request: {
                transform: [
                  {
                    transformer: 'jmespath',
                    mapping: `@`,
                  },
                ],
              },
              response: {
                transform: [
                  {
                    transformer: 'jmespath',
                    mapping: `@`,
                  },
                ],
              },
              url: 'http://example.com',
            },
          ],
        },
      });
      const payload = {
        type: 'NEXT',
      } satisfies Parameters<(typeof workflow)['sendEvent']>[0];
      // TODO: Fix `res.isDone` always returning false
      const _res = nock('http://example.com').get('/').reply(200, { data: 'Mocked response' });

      // Act
      await workflow.sendEvent(payload);
      await workflow.sendEvent(payload);

      // Assert
      // expect(res.isDone()).toBe(true);
    });

    it('should execute common plugins', async () => {
      // Arrange
      const workflow = generateWorkflow({
        workflowContext: {
          machineContext: {
            users: [{ name: 'test1' }, { name: 'test2' }],
          },
        },
        extensions: {
          apiPlugins: [
            {
              name: 'test',
              stateNames: ['second'],
              method: 'GET',
              request: {
                transform: [
                  {
                    transformer: 'jmespath',
                    mapping: `@`,
                  },
                ],
              },
              response: {
                transform: [
                  {
                    transformer: 'jmespath',
                    mapping: `@`,
                  },
                ],
              },
              url: 'http://example.com/',
            },
          ],
          commonPlugins: [
            {
              name: 'test',
              actionPluginName: 'test',
              stateNames: ['second'],
              iterateOn: [
                {
                  transformer: 'jmespath',
                  mapping: 'users',
                },
              ],
              response: {
                transform: [
                  {
                    transformer: 'jmespath',
                    mapping: '@',
                  },
                ],
              },
              successAction: 'NEXT',
            },
          ],
        },
      });
      const payload = {
        type: 'NEXT',
      } satisfies Parameters<(typeof workflow)['sendEvent']>[0];
      // TODO: Fix `res.isDone` always returning false
      const _res = nock('http://example.com').get('/').reply(200, { data: 'Mocked response' });

      // Act
      await workflow.sendEvent(payload);
      await workflow.sendEvent(payload);

      // Assert
      const state = workflow.getSnapshot().value;

      expect(state).toBe('fourth');
      // expect(res.isDone()).toBe(true);
    });

    it('should execute post-plugins', async () => {
      // Arrange
      const action = vi.fn();
      const workflow = generateWorkflow({
        extensions: {
          statePlugins: [
            {
              name: 'test',
              when: 'post',
              stateNames: ['second'],
              isBlocking: true,
              action,
            },
          ],
        },
      });
      const payload = {
        type: 'NEXT',
      } satisfies Parameters<(typeof workflow)['sendEvent']>[0];

      // Act
      await workflow.sendEvent(payload);
      await workflow.sendEvent(payload);

      // Assert
      expect(action).toHaveBeenCalledTimes(1);
      action.mockClear();
    });
  });

  describe('when using `subscribe`', () => {
    it('should call the passed callback', async () => {
      // Arrange
      const workflow = generateWorkflow();
      const callback = vi.fn();

      // Act
      workflow.subscribe(callback);
      await workflow.sendEvent({ type: 'NEXT' });

      // Assert
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({
        type: 'NEXT',
        state: 'second',
      });
    });
  });
});

describe('initiateApiPlugins #unit', () => {
  describe('when valid apiPluginSchemas are provided', () => {
    it('should initialize API plugins based on the schemas', () => {
      // Arrange
      const workflow = generateWorkflow();
      const apiPluginSchemas = [
        {
          name: 'TestPlugin1',
          stateNames: ['state1', 'state2'],
          url: 'http://example.com/api1',
          method: 'GET' as const,
          request: {
            transform: [
              {
                transformer: 'jmespath',
                mapping: `@`,
              },
            ],
          },
          response: {
            transform: [
              {
                transformer: 'jmespath',
                mapping: `@`,
              },
            ],
          },
          headers: { 'Content-Type': 'application/json' },
          successAction: 'successAction1',
          errorAction: 'errorAction1',
        },
      ] satisfies Parameters<(typeof workflow)['initiateApiPlugins']>[0];
      const expectedPluginStructure = {
        name: apiPluginSchemas[0]!.name,
        stateNames: apiPluginSchemas[0]!.stateNames,
        url: apiPluginSchemas[0]!.url,
        method: apiPluginSchemas[0]!.method,
        headers: {
          ...apiPluginSchemas[0]!.headers,
          accept: 'application/json',
        },
        request: { transformers: [new JmespathTransformer(`@`)], schemaValidator: undefined },
        response: { transformers: [new JmespathTransformer(`@`)], schemaValidator: undefined },
        successAction: apiPluginSchemas[0]!.successAction,
        errorAction: apiPluginSchemas[0]!.errorAction,
      };

      // Act
      const result = workflow.initiateApiPlugins(apiPluginSchemas);

      // Assert
      const actualPluginStructure = {
        name: result[0]!.name,
        stateNames: result[0]!.stateNames,
        url: result[0]!.url,
        method: result[0]!.method,
        headers: result[0]!.headers,
        request: result[0]!.request,
        response: result[0]!.response,
        successAction: result[0]!.successAction,
        errorAction: result[0]!.errorAction,
      };

      expect(result).toHaveLength(apiPluginSchemas.length);
      expect(actualPluginStructure).toEqual(expectedPluginStructure);
      expect(result[0]).toBeInstanceOf(ApiPlugin);
    });
  });

  describe('initiateChildPlugin #unit', () => {
    describe('when valid childPluginSchemas are provided', () => {
      it('should initialize API plugins based on the schemas', () => {
        // Arrange
        const workflow = generateWorkflow();
        const childPluginSchemas = [
          {
            name: 'TestPlugin1',
            stateNames: ['state1', 'state2'],
            definitionId: 'definitionId1',
            initEvent: 'initEvent1',
            transformers: [
              {
                transformer: 'jmespath',
                mapping: `@`,
              },
            ],
          },
        ] satisfies Parameters<(typeof workflow)['initiateChildPlugin']>[0];
        const expectedPluginStructure = {
          name: childPluginSchemas[0]!.name,
          stateNames: childPluginSchemas[0]!.stateNames,
          definitionId: childPluginSchemas[0]!.definitionId,
          initEvent: childPluginSchemas[0]!.initEvent,
          transformers: [new JmespathTransformer(`@`)],
        };

        // Act
        const result = workflow.initiateChildPlugin(childPluginSchemas, 'parent');

        // Assert
        const actualPluginStructure = {
          name: result[0]!.name,
          stateNames: result[0]!.stateNames,
          definitionId: result[0]!.definitionId,
          initEvent: result[0]!.initEvent,
          transformers: result[0]!.transformers,
        };

        expect(result).toHaveLength(childPluginSchemas.length);
        expect(actualPluginStructure).toEqual(expectedPluginStructure);
        expect(result[0]).toBeInstanceOf(ChildWorkflowPlugin);
      });
    });
  });
});
