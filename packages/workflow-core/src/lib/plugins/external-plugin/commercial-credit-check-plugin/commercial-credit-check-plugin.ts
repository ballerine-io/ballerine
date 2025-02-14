import { z } from 'zod';
import merge from 'lodash.merge';
import { invariant } from 'outvariant';
import { isErrorWithMessage, ProcessStatus } from '@ballerine/common';

import { logger } from '../../../logger';
import { ApiPlugin } from '../api-plugin';
import { TContext } from '../../../utils/types';
import { validateEnv } from '../shared/validate-env';
import { IApiPluginParams, PluginPayloadProperty } from '../types';
import { getPayloadPropertiesValue } from '../shared/get-payload-properties-value';

const CommercialCreditCheckPluginPayloadSchema = z.object({
  clientId: z.string().min(1),
  vendor: z.enum(['experian']),
  businessType: z.string().min(1),
  legalForm: z.string().min(1),
  companyRegistrationNumber: z.union([z.string(), z.undefined()]),
  registeredCharityNumber: z.union([z.string(), z.undefined()]),
});

type TCommercialCreditCheckPluginPayload = {
  clientId: PluginPayloadProperty;
  businessType?: PluginPayloadProperty;
  legalForm?: PluginPayloadProperty;
  companyRegistrationNumber?: PluginPayloadProperty<string | undefined>;
  registeredCharityNumber?: PluginPayloadProperty<string | undefined>;
};

const CommercialCreditCheckResponseSchema = z.record(z.string(), z.unknown());

export class CommercialCreditCheckPlugin extends ApiPlugin {
  public static pluginType = 'http';
  public payload: TCommercialCreditCheckPluginPayload;

  private pluginName = 'Commercial Credit Check Plugin';

  constructor({
    payload,
    ...pluginParams
  }: IApiPluginParams & { payload: CommercialCreditCheckPlugin['payload'] }) {
    const commercialCreditCheckPluginParams = {
      ...pluginParams,
      method: 'POST' as const,
    };

    super(commercialCreditCheckPluginParams);

    this.payload = payload;

    merge(this.payload, {
      vendor: pluginParams.vendor || 'experian',
      businessType: {
        __type: 'path',
        value: 'entity.data.businessType',
      },
      legalForm: {
        __type: 'path',
        value: 'entity.data.legalForm',
      },
      companyRegistrationNumber: {
        __type: 'path',
        value: 'entity.data.registrationNumber',
      },
      registeredCharityNumber: {
        __type: 'path',
        value: 'entity.data.additionalInfo.registeredCharityNumber',
      },
    });
  }

  async invoke(context: TContext) {
    const env = validateEnv(this.pluginName);

    try {
      const url = `${env.UNIFIED_API_URL}/commercial-credit-check`;

      const payload = getPayloadPropertiesValue({
        properties: this.payload,
        context,
      });

      const validatedPayload = CommercialCreditCheckPluginPayloadSchema.safeParse(payload);

      if (!validatedPayload.success) {
        return this.returnErrorResponse(
          `${this.pluginName} - Invalid payload: ${JSON.stringify(validatedPayload.error.errors)}`,
        );
      }

      if (validatedPayload.data.businessType === 'sole_proprietorship') {
        return this.successAction
          ? this.returnSuccessResponse(this.successAction, {
              name: this.name,
              status: ProcessStatus.CANCELED,
            })
          : {};
      }

      logger.log(`${this.pluginName} - Sending API request`, {
        url,
        method: this.method,
      });

      const apiResponse = await this.makeApiRequest(url, this.method, validatedPayload.data, {
        ...this.headers,
        Authorization: `Bearer ${env.UNIFIED_API_TOKEN}`,
      });

      logger.log(`${this.pluginName} - Received response`, {
        status: apiResponse.statusText,
        url,
      });

      const contentLength = apiResponse.headers.get('content-length');

      invariant(
        !contentLength || Number(contentLength) > 0,
        `${this.pluginName} - Received an empty response`,
      );

      if (!apiResponse.ok) {
        const errorResponse = await apiResponse.json();

        return this.returnErrorResponse(
          `${this.pluginName} - Request Failed: ${apiResponse.statusText} Error: ${JSON.stringify(
            errorResponse,
          )}`,
        );
      }

      const response = await apiResponse.json();
      const parsedResponse = CommercialCreditCheckResponseSchema.safeParse(response);

      if (!parsedResponse.success) {
        return this.returnErrorResponse(
          `${this.pluginName} - Invalid response: ${JSON.stringify(parsedResponse.error)}`,
        );
      }

      if (this.successAction) {
        return this.returnSuccessResponse(this.successAction, {
          ...parsedResponse.data,
          name: this.name,
          status: ProcessStatus.SUCCESS,
        });
      }

      return {};
    } catch (error) {
      logger.error(`${this.pluginName} - Error occurred while sending an API request`, { error });

      return this.returnErrorResponse(
        isErrorWithMessage(error)
          ? `${this.pluginName} - ${error.message}`
          : `${this.pluginName} - Unknown error`,
      );
    }
  }
}
