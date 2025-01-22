import { AnyRecord } from '@ballerine/common';
import { beforeEach, describe, expect, it, SpyInstance, vi } from 'vitest';
import { ApiPlugin, invokedAtTransformerDefinition } from './api-plugin';

describe('ApiPlugin', () => {
  describe('apiPlugin.invoke', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should call generateRequestPayloadFromWhitelist', async () => {
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
        whitelistedInputProperties: undefined,
      });

      const generateRequestPayloadFromWhitelistSpy = vi.spyOn(
        apiPlugin,
        'generateRequestPayloadFromWhitelist',
      );
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

      expect(generateRequestPayloadFromWhitelistSpy).toHaveBeenCalledWith(context);
      expect(generateRequestPayloadFromWhitelistSpy).toHaveBeenCalledTimes(1);
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

      describe('failed request', () => {
        it('should include requestPayload', async () => {
          const context = { test: '123' };

          transformDataSpy.mockResolvedValue(context);
          makeApiRequestSpy.mockResolvedValue({
            statusText: 'OK',
            ok: false,
            json: () => Promise.resolve({}),
            headers: new Headers(),
          });

          const invokeResult = (await apiPlugin.invoke(context)) as { requestPayload: AnyRecord };

          expect(invokeResult).toHaveProperty('requestPayload');
          expect(invokeResult.requestPayload).toContain(context);
        });
      });

      describe('not valid response', () => {
        it('should include requestPayload', async () => {
          const context = { test: '123' };

          transformDataSpy.mockResolvedValue(context);
          validateContentSpy.mockResolvedValue({ isValidResponse: false });
          makeApiRequestSpy.mockResolvedValue({
            statusText: 'OK',
            ok: true,
            json: () => Promise.resolve({}),
            headers: new Headers(),
          });

          const invokeResult = (await apiPlugin.invoke(context)) as { requestPayload: AnyRecord };

          expect(invokeResult).toHaveProperty('requestPayload');
          expect(invokeResult.requestPayload).toEqual(context);
        });
      });

      describe('not valid request', () => {
        it('should include requestPayload', async () => {
          const context = { test: '123' };

          transformDataSpy.mockResolvedValue(context);
          validateContentSpy.mockResolvedValue({ isValidRequest: false });

          const invokeResult = (await apiPlugin.invoke(context)) as { requestPayload: AnyRecord };

          expect(invokeResult).toHaveProperty('requestPayload');
          expect(invokeResult.requestPayload).toEqual(context);
        });
      });
    });

    describe('includeInvokedAt', () => {
      let apiPlugin: ApiPlugin;
      let transformDataSpy: SpyInstance;
      let validateContentSpy: SpyInstance;
      let makeApiRequestSpy: SpyInstance;

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
          request: { transformers: [] },
          response: { transformers: [] },
          includeInvokedAt: true,
        });

        transformDataSpy = vi.spyOn(apiPlugin, 'transformData') as SpyInstance;
        validateContentSpy = vi.spyOn(apiPlugin, 'validateContent') as SpyInstance;
        makeApiRequestSpy = vi.spyOn(apiPlugin, 'makeApiRequest') as SpyInstance;
      });

      it('should include invokedAt transformer if includeInvokedAt is true', async () => {
        apiPlugin.includeInvokedAt = true;

        const context = { test: '123' };
        const response = {};

        validateContentSpy.mockResolvedValue({ isValidResponse: true, isValidRequest: true });
        makeApiRequestSpy.mockResolvedValue({
          statusText: 'OK',
          ok: true,
          json: () => Promise.resolve(response),
          headers: new Headers(),
        });

        await apiPlugin.invoke(context);

        expect(transformDataSpy).toHaveBeenLastCalledWith(
          [expect.objectContaining({ mapping: [invokedAtTransformerDefinition] })],
          expect.objectContaining({ invokedAt: expect.any(Number) }),
        );
      });

      it('should not include invokedAt transformer if includeInvokedAt is false', async () => {
        apiPlugin.includeInvokedAt = false;

        const context = { test: '123' };
        const response = {};

        validateContentSpy.mockResolvedValue({ isValidResponse: true, isValidRequest: true });
        makeApiRequestSpy.mockResolvedValue({
          statusText: 'OK',
          ok: true,
          json: () => Promise.resolve(response),
          headers: new Headers(),
        });

        await apiPlugin.invoke(context);

        expect(transformDataSpy).toHaveBeenLastCalledWith([], response);
      });
    });

    describe('generateRequestPayloadFromWhitelist', () => {
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

      it('builds request payload from whitelisted input properties', () => {
        apiPlugin = new ApiPlugin({
          name: 'ballerineEnrichment',
          displayName: 'Ballerine Enrichment',
          url: 'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/business_test_us.jsonn',
          method: 'GET' as const,
          stateNames: ['checkBusinessScore'],
          successAction: 'API_CALL_SUCCESS',
          errorAction: 'API_CALL_FAILURE',
          whitelistedInputProperties: ['allowedProp1', 'allowedProp2'],
        });

        const payload = {
          allowedProp1: 'https://example.com',
          allowedProp2: 'https://example.com123',
          notAllowedProp1: 'https://example.com123',
          notAllowedProp2: 'https://example.com123',
        };
        const result = apiPlugin.generateRequestPayloadFromWhitelist(payload);
        expect(result).toEqual({
          allowedProp1: 'https://example.com',
          allowedProp2: 'https://example.com123',
        });
      });

      it('should include nested objects of whitelisted properties', () => {
        apiPlugin = new ApiPlugin({
          name: 'ballerineEnrichment',
          displayName: 'Ballerine Enrichment',
          url: 'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/business_test_us.jsonn',
          method: 'GET' as const,
          stateNames: ['checkBusinessScore'],
          successAction: 'API_CALL_SUCCESS',
          errorAction: 'API_CALL_FAILURE',
          whitelistedInputProperties: ['allowedProp1', 'allowedProp2'],
        });

        const payload = {
          allowedProp1: 'https://example.com',
          allowedProp2: {
            nestedProp1: 'https://example.com123',
            nestedProp2: 'https://example.com123',
          },
          notAllowedProp1: 'https://example.com123',
          notAllowedProp2: 'https://example.com123',
        };
        const result = apiPlugin.generateRequestPayloadFromWhitelist(payload);
        expect(result).toEqual({
          allowedProp1: 'https://example.com',
          allowedProp2: {
            nestedProp1: 'https://example.com123',
            nestedProp2: 'https://example.com123',
          },
        });
      });

      it('should not lookup for whitelisted properties in arrays', () => {
        apiPlugin = new ApiPlugin({
          name: 'ballerineEnrichment',
          displayName: 'Ballerine Enrichment',
          url: 'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/business_test_us.jsonn',
          method: 'GET' as const,
          stateNames: ['checkBusinessScore'],
          successAction: 'API_CALL_SUCCESS',
          errorAction: 'API_CALL_FAILURE',
          whitelistedInputProperties: ['allowedProp1', 'allowedProp2'],
        });

        const payload = {
          someArray: [{ allowedProp1: 'https://example.com' }],
          allowedProp2: 'https://example.com',
        };
        const result = apiPlugin.generateRequestPayloadFromWhitelist(payload);
        expect(result).toEqual({
          allowedProp2: 'https://example.com',
        });
      });

      it('should not modify the original payload if no whitelisted properties are provided', () => {
        const payload = { data: 'test' };
        const result = apiPlugin.generateRequestPayloadFromWhitelist(payload);
        expect(result).toEqual({ data: 'test' });
      });
    });
  });
});
