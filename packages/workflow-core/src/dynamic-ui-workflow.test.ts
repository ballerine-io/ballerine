import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createWorkflow } from './lib';
import {
  dynamicUiWorkflowDefinition,
  EMAIL_API_URL,
  Event,
  State,
  UNIFIED_API_URL,
} from './dynamic-ui-workflow';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const id = '123';
const companyName = 'Test Company';
const firstName = 'John';
const lastName = 'Doe';
const email = 'john.doe@example.com';

const generateDynamicUiWorkflow = () =>
  createWorkflow({
    runtimeId: '321',
    definition: dynamicUiWorkflowDefinition.definition,
    definitionType: dynamicUiWorkflowDefinition.definitionType,
    extensions: dynamicUiWorkflowDefinition.extensions,
    workflowContext: {
      machineContext: {
        entity: {
          id,
          data: {
            companyName,
            additionalInfo: {
              mainRepresentative: {
                firstName,
                lastName,
                email,
              },
            },
          },
          type: 'business',
        },
        documents: [],
        metadata: {
          customerName: 'Test Customer',
          token: '123',
        },
      },
      state: dynamicUiWorkflowDefinition.definition.initial,
    },
  });

describe('Dynamic UI Workflow #workflow #e2e #api', () => {
  const server = setupServer();

  beforeAll(async () => {
    server.listen();

    server.use(
      rest.get(`${UNIFIED_API_URL}/companies`, (req, res, ctx) => {
        return res(ctx.json({}));
      }),
    );
    server.use(
      rest.post(EMAIL_API_URL, (req, res, ctx) => {
        return res(ctx.json({}));
      }),
    );
  });

  afterAll(async () => {
    server.close();
  });

  describe('when creating the workflow', () => {
    it('should send the collection flow invitation email', async () => {
      // Arrange
      const service = generateDynamicUiWorkflow();

      // Act
      await service.sendEvent({
        type: Event.START,
      });

      // Assert
      const { value: state, context } = service.getSnapshot();

      expect(state).toBe(State.COLLECTION_FLOW);
      expect(context.pluginsOutput.collection_invite_email).not.toHaveProperty('error');
    });
  });
});
