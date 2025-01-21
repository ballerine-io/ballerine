import { ProcessStatus } from '@ballerine/common';
import { beforeEach, describe, expect, it, SpyInstance, vi } from 'vitest';
import { WorkflowRunnerArgs } from '../../types';
import { WorkflowRunner } from '../../workflow-runner';
import { ApiPlugin } from '../external-plugin';
import { ISerializableHttpPluginParams } from './types';

const createWorkflowRunner = (
  definition: WorkflowRunnerArgs['definition'],
  apiPluginsSchemas: ISerializableHttpPluginParams[],
) => {
  return new WorkflowRunner({
    runtimeId: '',
    definition,
    extensions: {
      apiPlugins: apiPluginsSchemas,
    },
    workflowContext: { machineContext: { entity: { id: 'some_id' } } },
  });
};

describe('workflow-runner', () => {
  describe('api plugins', () => {
    const definition = {
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
    } satisfies ConstructorParameters<typeof WorkflowRunner>[0]['definition'];

    const apiPluginsSchemas = [
      {
        name: 'ballerineEnrichment',
        displayName: 'Ballerine Enrichment',
        url: 'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/business_test_us.json',
        method: 'GET' as const,
        stateNames: ['checkBusinessScore'],
        successAction: 'API_CALL_SUCCESS',
        errorAction: 'API_CALL_FAILURE',
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: '{data: entity.id}',
            },
          ],
        },
        response: {
          transform: [{ transformer: 'jmespath', mapping: '{result: @}' }],
        },
      },
    ];

    describe('when api plugin tranforms and makes a request to an external api', () => {
      const workflow = createWorkflowRunner(definition, apiPluginsSchemas);
      it('transitions to successAction and persist response to context', async () => {
        await workflow.sendEvent({ type: 'CHECK_BUSINESS_SCORE' });

        expect(workflow.state).toEqual('checkBusinessScoreSuccess');
        expect(
          (
            workflow.context as {
              pluginsOutput: Record<string, unknown>;
            }
          ).pluginsOutput,
        ).toEqual({
          ballerineEnrichment: {
            invokedAt: expect.any(Number),
            result: {
              companyInfo: {
                companyName: 'TestCorp Ltd',
                industry: 'Software',
                location: 'New York, USA',
                country: 'US',
                yearEstablished: 1995,
                numberOfEmployees: 500,
                ceo: 'John Doe',
                products: ['Product A', 'Product B', 'Product C'],
                website: 'www.testcorpltd.com',
              },
            },
          },
        });
      });
    });

    describe('when api invalid jmespath transformation of request', () => {
      const apiPluginsSchemasCopy = structuredClone(apiPluginsSchemas);
      apiPluginsSchemasCopy[0]!.request.transform[0].mapping = 'dsa: .unknwonvalue.id}';
      const workflow = createWorkflowRunner(definition, apiPluginsSchemasCopy);
      it('returns error for transformation and transition to testManually', async () => {
        await workflow.sendEvent({ type: 'CHECK_BUSINESS_SCORE' });

        expect(workflow.state).toEqual('testManually');
        expect(
          (
            workflow.context as {
              pluginsOutput: Record<string, unknown>;
            }
          ).pluginsOutput,
        ).toEqual({
          ballerineEnrichment: {
            error:
              'Error transforming data: Unexpected token type: Colon, value: : for transformer mapping: "dsa: .unknwonvalue.id}"',
            name: 'ballerineEnrichment',
            status: ProcessStatus.ERROR,
          },
        });
      });
    });

    describe('when api plugin has schema', () => {
      describe('when api request invalid for schema', () => {
        const apiPluginsSchemasCopy = structuredClone(apiPluginsSchemas);
        // @ts-expect-error - `schema` type is wrong
        apiPluginsSchemasCopy[0]!.request.schema = {
          $schema: 'http://json-schema.org/draft-07/schema#',
          type: 'object',
          properties: {
            business_name: {
              type: 'string',
            },
            registration_number: {
              type: 'string',
            },
          },
          required: ['business_name', 'registration_number'],
        };
        const workflow = createWorkflowRunner(definition, apiPluginsSchemasCopy);

        it('returns error for transformation and transition to testManually', async () => {
          await workflow.sendEvent({ type: 'CHECK_BUSINESS_SCORE' });

          expect(workflow.state).toEqual('testManually');
          expect(
            (
              workflow.context as {
                pluginsOutput: Record<string, unknown>;
              }
            ).pluginsOutput,
          ).toEqual({
            ballerineEnrichment: {
              error:
                " - must have required property 'business_name' |  - must have required property 'registration_number'",
              name: 'ballerineEnrichment',
              status: ProcessStatus.ERROR,
            },
          });
        });
      });

      describe('when api request valid schema', () => {
        const apiPluginsSchemasCopy = structuredClone(apiPluginsSchemas);

        // @ts-expect-error - `schema` type is wrong
        apiPluginsSchemasCopy[0]!.request.schema = {
          $schema: 'http://json-schema.org/draft-07/schema#',
          type: 'object',
          properties: {
            data: {
              type: 'string',
            },
          },
          required: ['data'],
        };
        const workflow = createWorkflowRunner(definition, apiPluginsSchemasCopy);

        it('transitions to successAction and persist success (response) to context', async () => {
          await workflow.sendEvent({ type: 'CHECK_BUSINESS_SCORE' });

          expect(workflow.state).toEqual('checkBusinessScoreSuccess');
          expect(
            Object.keys(
              (
                workflow.context as {
                  pluginsOutput: {
                    ballerineEnrichment: Record<string, unknown>;
                  };
                }
              ).pluginsOutput.ballerineEnrichment,
            )[0],
          ).toEqual('result');
        });
      });
    });
  });

  describe('apiPlugin.invoke', async () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should call removeBlacklistedKeys', async () => {
      const context = { data: 'test' };
      const apiPlugin = new ApiPlugin({
        name: 'ballerineEnrichment',
        displayName: 'Ballerine Enrichment',
        url: 'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/business_test_us.jsonn',
        method: 'GET' as const,
        stateNames: ['checkBusinessScore'],
        successAction: 'API_CALL_SUCCESS',
        errorAction: 'API_CALL_FAILURE',
        request: {
          transformers: [],
        },
      });

      const removeBlacklistedKeysSpy = vi.spyOn(apiPlugin, 'removeBlacklistedKeys');
      const transformDataSpy = vi.spyOn(apiPlugin, 'transformData');
      const validateContentSpy = vi.spyOn(apiPlugin, 'validateContent');
      const makeApiRequestSpy = vi.spyOn(apiPlugin, 'makeApiRequest');

      transformDataSpy.mockResolvedValue(context);
      validateContentSpy.mockResolvedValue({ isValidRequest: true });
      makeApiRequestSpy.mockResolvedValue({
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve(context),
        headers: new Headers(),
      });

      await apiPlugin.invoke(context);

      expect(removeBlacklistedKeysSpy).toHaveBeenCalledWith(context);
    });

    describe('requestPayload', () => {
      let apiPlugin: ApiPlugin;
      let transformDataSpy: ReturnType<typeof vi.spyOn>;
      let validateContentSpy: ReturnType<typeof vi.spyOn>;
      let makeApiRequestSpy: ReturnType<typeof vi.spyOn>;

      beforeEach(() => {
        vi.clearAllMocks();

        apiPlugin = new ApiPlugin({
          name: 'ballerineEnrichment',
          displayName: 'Ballerine Enrichment',
          url: 'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/business_test_us.jsonn',
          method: 'GET' as const,
          stateNames: ['checkBusinessScore'],
          successAction: 'API_CALL_SUCCESS',
          errorAction: 'API_CALL_FAILURE',
          response: {
            transformers: [],
          },
          request: {
            transformers: [],
          },
        });

        transformDataSpy = vi.spyOn(apiPlugin, 'transformData') as SpyInstance;
        validateContentSpy = vi.spyOn(apiPlugin, 'validateContent') as SpyInstance;
        makeApiRequestSpy = vi.spyOn(apiPlugin, 'makeApiRequest') as SpyInstance;
      });

      it('status ok should include requestPayload', async () => {
        const context = { test: '123' };

        transformDataSpy.mockResolvedValue(context);
        validateContentSpy.mockResolvedValue({ isValidRequest: true });
        makeApiRequestSpy.mockResolvedValue({
          statusText: 'OK',
          ok: true,
          json: () => Promise.resolve({}),
          headers: new Headers(),
        });

        expect(await apiPlugin.invoke(context)).toHaveProperty('requestPayload', context);
      });

      it('failed request should include requestPayload', async () => {
        const context = { test: '123' };

        transformDataSpy.mockResolvedValue(context);
        validateContentSpy.mockResolvedValue({ isValidRequest: false });
        makeApiRequestSpy.mockResolvedValue({
          statusText: 'OK',
          ok: false,
          json: () => Promise.resolve({}),
          headers: new Headers(),
        });

        await apiPlugin.invoke(context);

        expect(await apiPlugin.invoke(context)).toHaveProperty('requestPayload', context);
      });
    });
  });

  describe('removeBlacklistedKeys', () => {
    let apiPlugin: ApiPlugin;

    beforeEach(() => {
      apiPlugin = new ApiPlugin({
        name: 'ballerineEnrichment',
        displayName: 'Ballerine Enrichment',
        url: 'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/business_test_us.jsonn',
        method: 'GET' as const,
        stateNames: ['checkBusinessScore'],
        successAction: 'API_CALL_SUCCESS',
        errorAction: 'API_CALL_FAILURE',
      });
    });

    it('removes blacklisted keys from request payload', () => {
      const payload = { callbackUrl: 'https://example.com', data: 'test' };
      const result = apiPlugin.removeBlacklistedKeys(payload);
      expect(result).toEqual({ data: 'test' });
    });

    it('doesnt remove non-blacklisted keys', () => {
      const payload = { callbackUrl: 'https://example.com', data: 'test' };
      const result = apiPlugin.removeBlacklistedKeys(payload);
      expect(result).toEqual({ data: 'test' });
    });

    it('correctly handles nested objects', () => {
      const payload = { data: { callbackUrl: 'https://example.com' } };
      const result = apiPlugin.removeBlacklistedKeys(payload);
      expect(result).toEqual({ data: {} });
    });
  });
});
