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
  address?: {
    streetNumber: PluginPayloadProperty;
    street: PluginPayloadProperty;
    city: PluginPayloadProperty;
    postcode: PluginPayloadProperty;
  };
  bankAccountDetails?: {
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
    | {
        holder: { bankAccountName: PluginPayloadProperty } & (
          | { companyRegistrationNumber: PluginPayloadProperty }
          | { registeredCharityNumber: PluginPayloadProperty }
        );
      }
  );
};

const BankAccountVerificationResponseSchema = z.record(z.string(), z.unknown());

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

    merge(this.payload, {
      vendor: pluginParams.vendor || 'experian',
      address: {
        streetNumber: {
          __type: 'path',
          value: 'entity.data.address.streetNumber',
        },
        street: {
          __type: 'path',
          value: 'entity.data.address.street',
        },
        city: {
          __type: 'path',
          value: 'entity.data.address.city',
        },
        postcode: {
          __type: 'path',
          value: 'entity.data.address.postcode',
        },
      },
      bankAccountDetails: {
        holder: {
          bankAccountName: {
            __type: 'path',
            value: 'entity.data.bankInformation.bankAccountName',
          },
          companyRegistrationNumber: {
            __type: 'path',
            value: 'entity.data.registrationNumber',
          },
          registeredCharityNumber: {
            __type: 'path',
            value: 'entity.data.additionalInfo.registeredCharityNumber',
          },
          firstName: {
            __type: 'path',
            value: 'entity.data.bankInformation.bankAccountHolder.firstName',
          },
          middleName: {
            __type: 'path',
            value: 'entity.data.bankInformation.bankAccountHolder.middleName',
          },
          lastName: {
            __type: 'path',
            value: 'entity.data.bankInformation.bankAccountHolder.lastName',
          },
        },
        sortCode: {
          __type: 'path',
          value: 'entity.data.bankInformation.sortCode',
        },
        bankAccountNumber: {
          __type: 'path',
          value: 'entity.data.bankInformation.accountNumber',
        },
      },
    });
  }

  async invoke(context: TContext) {
    const env = validateEnv(this.pluginName);

    try {
      const url = `${env.UNIFIED_API_URL}/bank-account-verification`;

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

      const response = await apiResponse.json();
      const parsedResponse = BankAccountVerificationResponseSchema.safeParse(response);

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
