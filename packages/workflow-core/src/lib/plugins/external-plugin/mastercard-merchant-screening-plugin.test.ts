import { AnyRecord } from '@ballerine/common';
import { beforeEach, describe, expect, it, SpyInstance, vi } from 'vitest';
import { MastercardMerchantScreeningPlugin } from './mastercard-merchant-screening-plugin';

describe('Mastercard Merchant Screening Plugin', () => {
  it('should use default whitelisted properties', () => {
    const plugin = new MastercardMerchantScreeningPlugin({
      name: 'ballerineEnrichment',
      displayName: 'Ballerine Enrichment',
      url: 'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/business_test_us.jsonn',
      method: 'GET' as const,
      stateNames: ['checkBusinessScore'],
      successAction: 'API_CALL_SUCCESS',
      errorAction: 'API_CALL_FAILURE',
    });
    expect(plugin.whitelistedInputProperties).toEqual(['searchGlobally', 'merchant', 'principals']);
  });

  describe('invoke', () => {
    describe('requestPayload', () => {
      let mastercardMerchantScreeningPlugin: MastercardMerchantScreeningPlugin;
      let transformDataSpy: ReturnType<typeof vi.spyOn>;
      let validateContentSpy: ReturnType<typeof vi.spyOn>;
      let makeApiRequestSpy: ReturnType<typeof vi.spyOn>;

      beforeEach(() => {
        vi.clearAllMocks();

        mastercardMerchantScreeningPlugin = new MastercardMerchantScreeningPlugin({
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

        transformDataSpy = vi.spyOn(
          mastercardMerchantScreeningPlugin,
          'transformData',
        ) as SpyInstance;
        validateContentSpy = vi.spyOn(
          mastercardMerchantScreeningPlugin,
          'validateContent',
        ) as SpyInstance;
        makeApiRequestSpy = vi.spyOn(
          mastercardMerchantScreeningPlugin,
          'makeApiRequest',
        ) as SpyInstance;
      });

      it('status ok should include requestPayload', async () => {
        const context = { searchGlobally: true, merchant: {}, principals: [] };

        transformDataSpy.mockResolvedValue(context);
        validateContentSpy.mockResolvedValue({ isValidRequest: true });
        makeApiRequestSpy.mockResolvedValue({
          statusText: 'OK',
          ok: true,
          json: () => Promise.resolve({}),
          headers: new Headers(),
        });

        const invokeResult = (await mastercardMerchantScreeningPlugin.invoke(context)) as {
          requestPayload: AnyRecord;
        };

        expect(invokeResult).toHaveProperty('requestPayload');
        expect(invokeResult.requestPayload).toHaveProperty('merchant');
        expect(invokeResult.requestPayload).toHaveProperty('principals');
        expect(invokeResult.requestPayload).toHaveProperty('searchGlobally');
      });

      it('failed response should include requestPayload', async () => {
        const context = {
          searchGlobally: true,
          merchant: {},
          principals: [],
        };

        transformDataSpy.mockResolvedValue(context);
        validateContentSpy.mockResolvedValue({ isValidResponse: false });
        makeApiRequestSpy.mockResolvedValue({
          statusText: 'OK',
          ok: true,
          json: () => Promise.resolve({}),
          headers: new Headers(),
        });

        const invokeResult = (await mastercardMerchantScreeningPlugin.invoke(context)) as {
          requestPayload: AnyRecord;
        };

        expect(invokeResult).toHaveProperty('requestPayload');
        expect(Object.keys(invokeResult.requestPayload)).toEqual(Object.keys(context));
      });

      it('failed request should include requestPayload', async () => {
        const context = { searchGlobally: true, merchant: {}, principals: [] };

        transformDataSpy.mockResolvedValue(context);
        validateContentSpy.mockResolvedValue({ isValidRequest: true });
        makeApiRequestSpy.mockResolvedValue({
          statusText: 'OK',
          ok: false,
          json: () => Promise.resolve({}),
          headers: new Headers(),
        });

        const invokeResult = (await mastercardMerchantScreeningPlugin.invoke(context)) as {
          requestPayload: AnyRecord;
        };

        expect(invokeResult).toHaveProperty('requestPayload');
        expect(Object.keys(invokeResult.requestPayload)).toEqual(Object.keys(context));
      });
    });
  });

  describe('removeBlacklistedKeys', () => {
    let mastercardMerchantScreeningPlugin: MastercardMerchantScreeningPlugin;

    beforeEach(() => {
      mastercardMerchantScreeningPlugin = new MastercardMerchantScreeningPlugin({
        name: 'ballerineEnrichment',
        displayName: 'Ballerine Enrichment',
        url: 'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/business_test_us.jsonn',
        method: 'GET' as const,
        stateNames: ['checkBusinessScore'],
        successAction: 'API_CALL_SUCCESS',
        errorAction: 'API_CALL_FAILURE',
        whitelistedInputProperties: ['searchGlobally', 'merchant', 'principals'],
      });
    });

    it('removes non-whitelisted keys from request payload', () => {
      const payload = {
        searchGlobally: true,
        merchant: {},
        principals: [],
        notWhitelisted: 'Hello World',
      };
      const result = mastercardMerchantScreeningPlugin.generateRequestPayloadFromWhitelist(payload);
      expect(result).toEqual({
        searchGlobally: true,
        merchant: {},
        principals: [],
      });
    });
  });
});
