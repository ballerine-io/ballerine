import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkflowRunner } from '../../workflow-runner';
import { WorkflowRunnerArgs } from '../../types';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { WebhookPluginParams } from './types';

function createWorkflowRunner(
  definition: WorkflowRunnerArgs['definition'],
  webhookPluginsSchemas: WebhookPluginParams[],
) {
  return new WorkflowRunner({
    definition,
    extensions: {
      // @ts-expect-error - TODO: fix this
      apiPlugins: webhookPluginsSchemas,
    },
    workflowContext: { machineContext: { entity: { id: 'some_id' } } },
  });
}

describe('workflow-runner', () => {
  describe('webhook plugins', () => {
    const definition = {
      initial: 'initial',
      states: {
        initial: {
          on: {
            ALL_GOOD: {
              target: 'success',
            },
          },
        },
        success: {
          type: 'final',
        },
        fail: {
          type: 'final',
        },
      },
    } satisfies ConstructorParameters<typeof WorkflowRunner>[0]['definition'];

    const webhookUrl = 'https://SomeTestUrl.com/ballerine/test/url/123';
    const webhookPluginsSchemas = [
      {
        name: 'ballerineEnrichment',
        url: webhookUrl,
        method: 'GET',
        stateNames: ['success', 'type'],
        headers: {},
        request: {
          // TODO: Ensure if this is intentional
          // @ts-expect-error - this does not match the interface of IApiPluginParams['request']
          transform: [
            {
              transformer: 'jmespath',
              mapping: '{id: entity.id}',
            },
          ],
        },
      },
    ] satisfies Parameters<typeof createWorkflowRunner>[1];

    describe('when webhook plugin hits state', () => {
      const server = setupServer();

      beforeEach(() => {
        server.listen();
      });
      afterEach(() => {
        server.close();
      });

      let serverRequestUrl: string;

      server.use(
        rest.get(webhookUrl, (req, res, ctx) => {
          serverRequestUrl = req.url.toString();
          return res(ctx.json({ result: 'someResult' }));
        }),
      );
      const workflow = createWorkflowRunner(
        definition,
        // @ts-expect-error - see the comments on `webhookPluginsSchemas`
        webhookPluginsSchemas,
      );
      it('transitions to successAction and persist response to context', async () => {
        await workflow.sendEvent({ type: 'ALL_GOOD' });
        expect(serverRequestUrl).toEqual(
          'https://sometesturl.com/ballerine/test/url/123?id=some_id',
        );
      });
    });
  });
});
