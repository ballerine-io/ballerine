import { z } from 'zod';
import { invariant } from 'outvariant';
import {
  isErrorWithMessage,
  isObject,
  isType,
  ProcessStatus,
  UnifiedApiReason,
} from '@ballerine/common';

import { logger } from '../../../logger';
import { ApiPlugin } from '../api-plugin';
import { TContext } from '../../../utils/types';
import { validateEnv } from '../shared/validate-env';
import { IApiPluginParams, PluginPayloadProperty } from '../types';
import { getPayloadPropertiesValue } from '../shared/get-payload-properties-value';
import { handleJmespathTransformers } from '../shared/handle-jmespath-transformers';

const isObjectWithKycInformation = (obj: unknown) => {
  return isType(KycInformationSchema)(obj);
};

const KycInformationSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.string().date(),
});

const IndividualsSanctionsV2PluginPayloadSchema = z.object({
  vendor: z.enum(['veriff', 'test', 'dow-jones']),
  ongoingMonitoring: z.boolean(),
  immediateResults: z.boolean(),
  workflowRuntimeId: z.string().min(1),
  kycInformation: z.union([
    z.record(
      z.union([z.string(), z.number(), z.symbol()]),
      z.object({
        result: z.object({
          vendorResult: z.object({
            entity: z.object({
              data: KycInformationSchema,
            }),
          }),
        }),
      }),
    ),
    KycInformationSchema,
    z.array(
      KycInformationSchema.pick({
        firstName: true,
        lastName: true,
      }).extend({
        additionalInfo: z.object({
          dateOfBirth: KycInformationSchema.shape.dateOfBirth,
        }),
      }),
    ),
  ]),
  endUserId: z.string().min(1),
  clientId: z.string().min(1),
});

export class IndividualsSanctionsV2Plugin extends ApiPlugin {
  public static pluginType = 'http';
  public payload: {
    vendor: PluginPayloadProperty<string>;
    ongoingMonitoring: PluginPayloadProperty<boolean>;
    immediateResults: PluginPayloadProperty<boolean>;
    workflowRuntimeId: PluginPayloadProperty<string>;
    kycInformation: Extract<
      PluginPayloadProperty<{
        firstName: PluginPayloadProperty<string>;
        lastName: PluginPayloadProperty<string>;
        dateOfBirth: PluginPayloadProperty<string>;
      }>,
      { __type: 'path' }
    >;
    endUserId: PluginPayloadProperty<string>;
    clientId: PluginPayloadProperty<string>;
  };

  private pluginName = 'Individuals Sanctions V2 Plugin';

  constructor({
    payload,
    ...pluginParams
  }: IApiPluginParams & { payload: IndividualsSanctionsV2Plugin['payload'] }) {
    super({
      ...pluginParams,
      method: 'POST' as const,
    });

    this.payload = payload;

    handleJmespathTransformers({
      pluginName: this.pluginName,
      requestTransformers: this.request?.transformers,
      responseTransformers: this.response?.transformers,
    });
  }

  async invoke(context: TContext) {
    const env = validateEnv('Individuals Sanctions V2');
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
      const url = `${env.UNIFIED_API_URL}/aml-sessions`;
      const payload = getPayloadPropertiesValue({
        properties: this.payload,
        context,
      });
      const { workflowRuntimeId, kycInformation, ...validatedPayload } =
        IndividualsSanctionsV2PluginPayloadSchema.parse(payload);
      const callbackUrl = `${env.APP_API_URL}/api/v1/external/workflows/${workflowRuntimeId}/hook/${this.successAction}?resultDestination=pluginsOutput.kyc_session.kyc_session_1.result.aml&processName=aml-unified-api`;
      const getKycInformationByDataType = (
        kycInformation: z.output<
          typeof IndividualsSanctionsV2PluginPayloadSchema
        >['kycInformation'],
      ) => {
        if (Array.isArray(kycInformation)) {
          const [firstKycInformation] = kycInformation;

          invariant(
            firstKycInformation,
            `${this.pluginName} - no KYC information found at ${this.payload.kycInformation.value}`,
          );

          const { firstName, lastName, additionalInfo } = firstKycInformation;
          const { dateOfBirth } = additionalInfo;

          return {
            firstName,
            lastName,
            dateOfBirth,
          };
        }

        if (isObjectWithKycInformation(kycInformation)) {
          const { firstName, lastName, dateOfBirth } = kycInformation;

          return {
            firstName,
            lastName,
            dateOfBirth,
          };
        }

        if (isObject(kycInformation)) {
          const [firstKey] = Object.keys(kycInformation);

          invariant(
            firstKey && kycInformation[firstKey],
            `${this.pluginName} - no KYC information found at ${this.payload.kycInformation.value}`,
          );

          return kycInformation[firstKey].result.vendorResult.entity.data;
        }

        // Should never reach this point. Will reach here if error handling or validation changes.
        throw new Error(
          `${this.pluginName} - unexpected KYC information found at ${this.payload.kycInformation.value}`,
        );
      };
      const kycInformationByDataType = getKycInformationByDataType(kycInformation);

      requestPayload = {
        ...requestPayload,
        ...validatedPayload,
        ...kycInformationByDataType,
        callbackUrl,
      };

      logger.log(`${this.pluginName} - Sending API request`, {
        url,
        method: this.method,
      });

      const apiResponse = await this.makeApiRequest(url, this.method, requestPayload, {
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
          `Request Failed: ${apiResponse.statusText} Error: ${JSON.stringify(errorResponse)}`,
        );
      }

      const res = await apiResponse.json();
      const result = z.record(z.string(), z.unknown()).parse(res);
      const getPluginStatus = (response: Record<string, unknown>) => {
        if (response.reason === UnifiedApiReason.NOT_IMPLEMENTED) {
          return ProcessStatus.CANCELED;
        }

        if (response.error) {
          return ProcessStatus.ERROR;
        }

        return ProcessStatus.IN_PROGRESS;
      };

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
