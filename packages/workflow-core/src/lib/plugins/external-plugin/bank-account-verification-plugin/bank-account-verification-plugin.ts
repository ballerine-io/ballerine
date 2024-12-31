import { z } from 'zod';
import { invariant } from 'outvariant';
import { isErrorWithMessage } from '@ballerine/common';

import { logger } from '../../../logger';
import { ApiPlugin } from '../api-plugin';
import { TContext } from '../../../utils/types';
import { validateEnv } from '../shared/validate-env';
import { getPluginStatus } from '../shared/get-plugin-status';
import { getTransformer } from '../../../workflow-runner-utils';
import { IApiPluginParams, PluginPayloadProperty } from '../types';
import { getPayloadPropertiesValue } from '../shared/get-payload-properties-value';
import { handleJmespathTransformers } from '../shared/handle-jmespath-transformers';

const BankAccountVerificationPluginPayloadSchema = z.object({
  clientId: z.string().min(1),
  vendor: z.enum(['experian']),
  data: z.object({
    address: z.object({
      streetNumber: z.string().min(1),
      street: z.string().min(1),
      city: z.string().min(1),
      postCode: z.string().min(1),
    }),
    bankAccountDetails: z.object({
      holder: z.object({
        firstName: z.string().min(1),
        middleName: z.string().optional(),
        lastName: z.string().min(1),
      }),
      sortCode: z.string().min(1),
      bankAccountNumber: z.string().min(1),
    }),
  }),
});

type TBankAccountVerificationPluginPayload = {
  clientId: PluginPayloadProperty<string>;
  vendor: PluginPayloadProperty<string>;
  data: {
    address: {
      streetNumber: PluginPayloadProperty<string>;
      street: PluginPayloadProperty<string>;
      city: PluginPayloadProperty<string>;
      postCode: PluginPayloadProperty<string>;
    };
    bankAccountDetails: {
      sortCode: PluginPayloadProperty<string>;
      bankAccountNumber: PluginPayloadProperty<string>;
    } & (
      | {
          holder: {
            firstName: PluginPayloadProperty<string>;
            middleName: PluginPayloadProperty<string | undefined>;
            lastName: PluginPayloadProperty<string>;
          };
        }
      | { bankAccountName: PluginPayloadProperty<string> }
    );
  };
};

export class BankAccountVerificationPlugin extends ApiPlugin {
  public static pluginType = 'http';
  public payload: TBankAccountVerificationPluginPayload;

  constructor({
    payload,
    ...pluginParams
  }: IApiPluginParams & { payload: BankAccountVerificationPlugin['payload'] }) {
    super({
      ...pluginParams,
      response: {
        ...pluginParams.response,
        transformers: [
          ...(pluginParams.response?.transformers ?? []),
          getTransformer({
            mapping: [
              {
                method: 'setTimeToRecordUTC',
                source: 'invokedAt',
                target: 'invokedAt',
              },
            ],
            transformer: 'helper',
          }),
        ],
      },
      method: 'POST' as const,
    });

    this.payload = payload;

    handleJmespathTransformers({
      pluginName: 'Bank Account Verification Plugin',
      requestTransformers: this.request?.transformers,
      responseTransformers: this.response?.transformers,
    });
  }

  async invoke(context: TContext) {
    const env = validateEnv('Bank Account Verification');

    let requestPayload;

    if (this.request?.transformers) {
      requestPayload = await this.transformData(this.request.transformers, context);

      const { isValidRequest, errorMessage } = await this.validateContent(
        this.request.schemaValidator,
        requestPayload,
        'Request',
      );

      if (!isValidRequest) {
        return this.returnErrorResponse(errorMessage ?? 'Invalid request');
      }
    }

    try {
      const url = `${env.UNIFIED_API_URL}/bank-account-verification/commercial`;

      const payload = getPayloadPropertiesValue({
        properties: this.payload,
        context,
      });

      const validatedPayload = BankAccountVerificationPluginPayloadSchema.parse(payload);

      requestPayload = {
        ...requestPayload,
        ...validatedPayload,
      };

      logger.log('Bank Account Verification Plugin - Sending API request', {
        url,
        method: this.method,
      });

      const apiResponse = await this.makeApiRequest(url, this.method, requestPayload, {
        ...this.headers,
        Authorization: `Bearer ${env.UNIFIED_API_TOKEN}`,
      });

      logger.log('Bank Account Verification Plugin - Received response', {
        status: apiResponse.statusText,
        url,
      });

      const contentLength = apiResponse.headers.get('content-length');

      invariant(
        !contentLength || Number(contentLength) > 0,
        'Bank Account Verification Plugin - Received an empty response',
      );

      if (!apiResponse.ok) {
        const errorResponse = await apiResponse.json();

        return this.returnErrorResponse(
          `Request Failed: ${apiResponse.statusText} Error: ${JSON.stringify(errorResponse)}`,
        );
      }

      const res = await apiResponse.json();
      const result = z.record(z.string(), z.unknown()).parse(res);

      let responseBody = result;

      if (this.response?.transformers) {
        responseBody = await this.transformData(this.response.transformers, result);
      }

      responseBody = {
        ...responseBody,
        name: this.name,
        status: getPluginStatus(responseBody),
      };

      const { isValidResponse, errorMessage } = await this.validateContent(
        this.response?.schemaValidator,
        responseBody,
        'Response',
      );

      if (!isValidResponse) {
        return this.returnErrorResponse(errorMessage ?? 'Invalid response');
      }

      if (this.successAction) {
        return this.returnSuccessResponse(this.successAction, responseBody);
      }

      return {};
    } catch (error) {
      logger.error('Error occurred while sending an API request', { error });

      return this.returnErrorResponse(isErrorWithMessage(error) ? error.message : 'Unknown error');
    }
  }
}
