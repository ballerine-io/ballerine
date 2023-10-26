import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ChildPluginCallbackOutput, createWorkflow } from '../lib';
import { dynamicUiWorkflowDefinition } from './dynamic-ui-workflow';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { EMAIL_API_URL, Event, State, UNIFIED_API_URL } from './constants';
import { kycEmailSessionDefinition } from './kyc-email-process-example';

const id = '123';
const companyName = 'Test Company';
const firstName = 'John';
const lastName = 'Doe';
const email = 'john.doe@example.com';
const country = 'US' as const;
const registrationNumber = '123456789';
const state = 'NY';

let parentService: ReturnType<typeof createWorkflow>;

const generateDynamicUiWorkflow = () =>
  createWorkflow({
    runtimeId: 'parent-1',
    definition: dynamicUiWorkflowDefinition.definition,
    definitionType: dynamicUiWorkflowDefinition.definitionType,
    extensions: dynamicUiWorkflowDefinition.extensions,
    invokeChildWorkflowAction: async (childPluginConfiguration: ChildPluginCallbackOutput) => {
      if (!childPluginConfiguration.initOptions.event) return;

      const childService = createWorkflow({
        runtimeId: 'child-1',
        definition: kycEmailSessionDefinition.definition,
        definitionType: kycEmailSessionDefinition.definitionType,
        workflowContext: {
          machineContext: {},
          state: kycEmailSessionDefinition.definition.initial,
        },
      });

      await childService.sendEvent({
        type: childPluginConfiguration.initOptions.event,
      });
      await childService.sendEvent({
        type: 'KYC_HOOK_RESPONDED',
      });
      await parentService?.sendEvent({
        type: Event.KYC_RESPONDED,
      });
    },
    workflowContext: {
      machineContext: {
        entity: {
          id,
          data: {
            companyName,
            country,
            registrationNumber,
            additionalInfo: {
              ubos: [
                {
                  id: 'ubo-1',
                  type: 'individual',
                  data: {
                    firstName: '',
                    lastName: '',
                    email: '',
                    dateOfBirth: '',
                  },
                },
              ],
              state,
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
        childWorkflows: {
          kyc_email_session_example: {
            kyc_session_1: {
              result: {
                vendorResult: {
                  decision: 'approved',
                },
              },
            },
          },
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
      rest.get(
        `${UNIFIED_API_URL}/companies/${country}-${state}/${registrationNumber}`,
        (req, res, ctx) => {
          return res(
            ctx.json({
              country,
              state,
              registrationNumber,
            }),
          );
        },
      ),
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
      const { value: currentState, context } = service.getSnapshot();

      expect(currentState).toBe(State.COLLECTION_FLOW);
      expect(context.pluginsOutput.collection_invite_email).not.toHaveProperty('error');
    });

    it.only('should enrich context with KYB vendor data', async () => {
      // Arrange
      parentService = generateDynamicUiWorkflow();

      // Act
      await parentService.sendEvent({
        type: Event.START,
      });
      await parentService.sendEvent({
        type: Event.COLLECTION_FLOW_FINISHED,
      });

      // Assert
      const { value: currentState, context } = parentService.getSnapshot();

      expect(currentState).toBe(State.MANUAL_REVIEW);
      expect(context.pluginsOutput.open_corporates).toEqual({
        registrationNumber,
        country,
        state,
      });
    });
  });
});
