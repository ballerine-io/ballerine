import { describe, expect, it, vi } from 'vitest';
import { createWorkflow } from './create-workflow';
import nock from 'nock';
import { WorkflowRunner } from './workflow-runner';
import { ApiPlugin } from './plugins';
import { JmespathTransformer } from './utils';
import { ChildWorkflowPlugin } from './plugins/common-plugin/child-workflow-plugin';
import { IterativePlugin } from './plugins/common-plugin/iterative-plugin';
import { WorkflowEvents } from './types';

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
              displayName: 'Test',
              stateNames: ['second'],
              pluginKind: 'api',
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

    it.skip('should execute common plugins', async () => {
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
              displayName: 'Test',
              stateNames: ['second'],
              pluginKind: 'api',
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
              pluginKind: 'iterative',
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
      workflow.subscribe(WorkflowEvents.STATE_UPDATE, callback);
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
          displayName: 'Test',
          pluginKind: 'api',
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
      ];

      // Act
      const result = workflow.initiateApiPlugins(apiPluginSchemas);

      // Assert
      expect(result).toHaveLength(apiPluginSchemas.length);
      expect(result[0]).toBeInstanceOf(ApiPlugin);
      expect(result[0]?.name).toBe('TestPlugin1');
      expect(result[0]?.stateNames).toEqual(['state1', 'state2']);
      expect(result[0]?.url).toBe('http://example.com/api1');
      expect(result[0]?.method).toBe('GET');
    });
  });

  describe('initiateChildPlugin #unit', () => {
    describe('when valid childPluginSchemas are provided', () => {
      it('should initialize child plugins based on the schemas', () => {
        // Arrange
        const workflow = generateWorkflow();
        const childPluginSchemas = [
          {
            name: 'TestPlugin1',
            pluginKind: 'child',
            parentWorkflowRuntimeConfig: {},
            stateNames: ['state1', 'state2'],
            definitionId: 'definitionId1',
            initEvent: 'initEvent1',
            transform: [
              {
                transformer: 'jmespath',
                mapping: `@`,
              },
            ],
          },
        ];

        // Act
        const result = workflow.initiateChildPlugins(childPluginSchemas, 'parent', {});

        // Assert
        expect(result).toHaveLength(childPluginSchemas.length);
        expect(result[0]).toBeInstanceOf(ChildWorkflowPlugin);
        expect(result[0]?.name).toBe('TestPlugin1');
        expect(result[0]?.stateNames).toEqual(['state1', 'state2']);
        expect(result[0]?.definitionId).toBe('definitionId1');
        expect(result[0]?.initEvent).toBe('initEvent1');
      });
    });
  });

  describe('initiateCommonPlugins #unit', () => {
    describe('when valid commonPluginSchemas are provided', () => {
      it('should initialize common plugins based on the schemas', () => {
        // Arrange
        const workflow = generateWorkflow();
        const commonPluginSchemas = [
          {
            pluginKind: 'iterative',
            name: 'TestPlugin1',
            actionPluginName: 'actionPluginName1',
            stateNames: ['state1', 'state2'],
            iterateOn: [
              {
                transformer: 'jmespath',
                mapping: `users`,
              },
            ],
            response: {
              transform: [
                {
                  transformer: 'jmespath',
                  mapping: `@`,
                },
              ],
            },
          },
        ];

        // Act
        const result = workflow.initiateCommonPlugins(commonPluginSchemas, [
          {
            name: 'actionPluginName1',
            displayName: 'Action Plugin Name 1',
            pluginKind: 'api',
            stateNames: [],
            successAction: 'SUCCESS',
            errorAction: 'ERROR',
            persistResponseDestination: 'pluginsOutput.actionPluginName1',
          },
        ]);

        // Assert
        expect(result).toHaveLength(commonPluginSchemas.length);
        expect(result[0]).toBeInstanceOf(IterativePlugin);
        expect(result[0]?.name).toBe('TestPlugin1');
        expect(result[0]?.stateNames).toEqual(['state1', 'state2']);
        expect(result[0]?.iterateOn).toHaveLength(1);
        expect(result[0]?.iterateOn[0]).toBeInstanceOf(JmespathTransformer);
      });
    });
  });
});
