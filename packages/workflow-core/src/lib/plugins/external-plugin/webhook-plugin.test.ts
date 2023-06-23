import { beforeEach, afterEach, describe, expect, it, test } from 'vitest';
import { WorkflowRunner } from '../../workflow-runner';
import { WorkflowRunnerArgs } from '../../types';
import {WebhookPlugin, WebhookPluginParams} from "./webhook-plugin";
import {setupServer} from "msw/node";
import {rest} from "msw";

function createWorkflowRunner(
  definition: WorkflowRunnerArgs['definition'],
  webhookPluginsSchemas: WebhookPluginParams[],
) {
  return new WorkflowRunner({
    definition,
    extensions: {
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
    };

    let webhookUrl = 'https://SomeTestUrl.com/ballerine/test/url/123';
    let webhookPluginsSchemas = [
      {
        name: 'ballerineEnrichment',
        url: webhookUrl,
        method: 'GET',
        stateNames: ['success', 'type'],
        request: {
          transform: {
            transformer: 'jq',
            mapping: '{id: .entity.id}'
          },
        },
      },
    ];

    describe('when webhook plugin hits state', () => {
      const server = setupServer();

      beforeEach(() => {
        server.listen();
      });
      afterEach(() => {
        server.close();
      });

      let serverRequesUrl;
      server.use(
        rest.get(webhookUrl, (req, res, ctx) => {
          serverRequesUrl = req.url.toString()
          return res(ctx.json({result: 'someResult'}));
        }),
      );
      const workflow = createWorkflowRunner(definition, webhookPluginsSchemas);
      it('it transitions to successAction and persist response to context', async () => {
        await workflow.sendEvent('ALL_GOOD');
        expect(serverRequesUrl).toEqual("https://sometesturl.com/ballerine/test/url/123?id=some_id");
      });
    });
  });
});
