import { beforeEach, describe, expect, it, SpyInstance, vi } from 'vitest';
import { ApiPlugin } from './api-plugin';

describe('ApiPlugin', () => {
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
