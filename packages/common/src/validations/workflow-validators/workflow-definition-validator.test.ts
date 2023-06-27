import { describe, expect, it } from 'vitest';
import { validateWorkflowDefinition } from "./workflow-definition-validator";
describe('WorkflowDefinitionValidator', () => {
  describe('validate Api Plugin', () => {
    const definition = {
      id: 'kyb_example_v1',
      predictableActionArguments: true,
      context: {
        documents: [],
      },
      initial: 'initial',
      states: {
        initial: {
          on: {
            CHECK_BUSINESS_SCORE: {
              target: 'checkBusinessScore',
            },
          },
        },
        checkBusinessScore: {
          on: {
            API_CALL_SUCCESS: 'checkBusinessScoreSuccess',
            API_CALL_FAILURE: 'testManually',
          },
        },
        checkBusinessScoreSuccess: {
          type: 'final',
        },
        testManually: {
          type: 'final',
        },
      },
    };

    const apiPluginsSchemas = [
      {
        name: 'ballerineEnrichment',
        url: 'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/business_test_us.json',
        method: 'GET',
        stateNames: ['checkBusinessScore'],
        successAction: 'API_CALL_SUCCESS',
        errorAction: 'API_CALL_FAILURE',
        request: {
          transform: {
            transformer: 'jq',
            mapping: '{data: .entity.id}',
          },
        },
        response: {
          transform: { transformer: 'jq', mapping: '{result: .}' },
        },
      },
      {
        name: 'ballerineEnrichmentHook',
        url: 'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/business_test_us.json',
        method: 'GET',
        headers: {'some_header': 'some_value'},
        stateNames: ['checkBusinessScore'],
        request: {
          transform: {
            transformer: 'jq',
            mapping: '{data: .entity.id}',
          },
        },
      }
    ];

    const workflowDefinition = {
      ...definition,
      ...{extensions: {apiPlugins: apiPluginsSchemas}}
    }

    describe('when api plugin is valid', () => {
      it('returns valid response', async () => {
        const validationResponse = validateWorkflowDefinition(workflowDefinition);

        expect(validationResponse).toEqual({isValid: true, error: undefined});
      });
    });

    describe('when api plugin is invalid', () => {
      it('it returns invalid response', async () => {
        workflowDefinition.extensions.apiPlugins[0].request = "dwadwad"
        const validationResponse = validateWorkflowDefinition(workflowDefinition);

        expect(validationResponse).toEqual({isValid: false, error: "extensions.apiPlugins.0: Invalid input"});
      });
    });

  });
});
