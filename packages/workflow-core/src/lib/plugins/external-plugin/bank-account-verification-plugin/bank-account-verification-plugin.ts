import { z } from 'zod';
import { invariant } from 'outvariant';
import { isErrorWithMessage, ProcessStatus } from '@ballerine/common';

import { logger } from '../../../logger';
import { ApiPlugin } from '../api-plugin';
import { TContext } from '../../../utils/types';
import { validateEnv } from '../shared/validate-env';
import { IApiPluginParams, PluginPayloadProperty } from '../types';
import { getPayloadPropertiesValue } from '../shared/get-payload-properties-value';

const BankAccountVerificationPluginPayloadSchema = z.object({
  clientId: z.string().min(1),
  vendor: z.enum(['experian']),
  address: z.object({
    streetNumber: z.string().min(1),
    street: z.string().min(1),
    city: z.string().min(1),
    postcode: z.string().min(1),
  }),
  bankAccountDetails: z.object({
    holder: z.union([
      z.union([
        z.object({
          bankAccountName: z.string().min(1),
          companyRegistrationNumber: z.string().min(1),
        }),
        z.object({
          bankAccountName: z.string().min(1),
          registeredCharityNumber: z.string().min(1),
        }),
      ]),
      z.object({
        firstName: z.string().min(1),
        middleName: z.string().optional(),
        lastName: z.string().min(1),
      }),
    ]),
    sortCode: z.string().min(1),
    bankAccountNumber: z.string().min(1),
  }),
});

type TBankAccountVerificationPluginPayload = {
  clientId: PluginPayloadProperty;
  vendor: PluginPayloadProperty;
  data: {
    address: {
      streetNumber: PluginPayloadProperty;
      street: PluginPayloadProperty;
      city: PluginPayloadProperty;
      postcode: PluginPayloadProperty;
    };
    bankAccountDetails: {
      sortCode: PluginPayloadProperty;
      bankAccountNumber: PluginPayloadProperty;
    } & (
      | {
          holder: {
            firstName: PluginPayloadProperty;
            middleName: PluginPayloadProperty<string | undefined>;
            lastName: PluginPayloadProperty;
          };
        }
      | ({ bankAccountName: PluginPayloadProperty } & (
          | { companyRegistrationNumber: PluginPayloadProperty }
          | { registeredCharityNumber: PluginPayloadProperty }
        ))
    );
  };
};

export class BankAccountVerificationPlugin extends ApiPlugin {
  public static pluginType = 'http';
  public payload: TBankAccountVerificationPluginPayload;

  private pluginName = 'Bank Account Verification Plugin';

  constructor({
    payload,
    ...pluginParams
  }: IApiPluginParams & { payload: BankAccountVerificationPlugin['payload'] }) {
    const bankAccountVerificationPluginParams = {
      ...pluginParams,
      method: 'POST' as const,
    };

    super(bankAccountVerificationPluginParams);

    this.payload = payload;
  }

  async invoke(context: TContext) {
    const env = validateEnv(this.pluginName);

    try {
      const url = `${env.UNIFIED_API_URL}/bank-account-verification/commercial`;

      const payload = getPayloadPropertiesValue({
        properties: this.payload,
        context,
      });

      const validatedPayload = BankAccountVerificationPluginPayloadSchema.safeParse(payload);

      if (!validatedPayload.success) {
        return this.returnErrorResponse(
          `${this.pluginName} - Invalid payload: ${JSON.stringify(validatedPayload.error.errors)}`,
        );
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

      const res = await apiResponse.json();
      const responseBody = z.record(z.string(), z.unknown()).parse(res);

      if (this.successAction) {
        return this.returnSuccessResponse(this.successAction, {
          ...responseBody,
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
