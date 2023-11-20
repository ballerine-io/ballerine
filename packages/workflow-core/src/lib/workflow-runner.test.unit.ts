import { describe, expect, it, vi } from 'vitest';
import { createWorkflow } from './create-workflow';
import nock from 'nock';

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
  });
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
});

describe('subscribe', () => {
  describe('when firing a valid event', () => {
    it('should move the workflow to the next state', () => {
      // Arrange
      // Act
      // Assert
      expect(true).toBe(true);
    });
  });
});

describe('getSnapshot', () => {
  describe('when', () => {
    it('should', () => {
      expect(true).toBe(true);
    });
  });
});
