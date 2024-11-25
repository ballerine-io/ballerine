import {
  isErrorWithMessage,
  isObject,
  isType,
  ProcessStatus,
  UnifiedApiReason,
} from '@ballerine/common';
import { logger } from '../../../logger';
import { TContext } from '../../../utils/types';
import { ApiPlugin } from '../api-plugin';
import { IApiPluginParams } from '../types';
import get from 'lodash.get';
import { z } from 'zod';
import { invariant } from 'outvariant';
import { getTransformer } from '../../../workflow-runner-utils';

export type PluginPayloadProperty<TValue> =
  | {
      type: 'literal';
      /** @example 10 */
      value: TValue;
    }
  | {
      type: 'path';
      /** @example entity.data.address.country */
      value: string;
    };

/**
 * Get the value of the properties in the payload depending on the type of the property i.e. 'literal' or 'path'
 * @param properties
 * @param context
 */
export const getPayloadPropertiesValue = ({
  properties,
  context,
}: {
  properties: Record<PropertyKey, PluginPayloadProperty<unknown>>;
  context: TContext;
}) => {
  return Object.entries(properties).reduce((acc, [key, property]) => {
    if (property.type === 'literal') {
      acc[key] = property.value;

      return acc;
    }

    if (property.type === 'path') {
      acc[key] = get(context, property.value);

      return acc;
    }

    property['type'] satisfies never;
    throw new Error(`Unknown property type: "${property['type']}"`);
  }, {} as Record<PropertyKey, unknown>);
};

const isObjectWithKycInformation = (obj: unknown) => {
  return isType(KycInformationSchema)(obj);
};
const removeTrailSlash = (url: string) => {
  return url.replace(/\/$/, '');
};

const EnvSchema = z.object({
  UNIFIED_API_URL: z.string().url().transform(removeTrailSlash),
  UNIFIED_API_TOKEN: z.string().min(1),
  APP_API_URL: z.string().url().transform(removeTrailSlash),
});
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

const validateEnv = () => {
  const result = EnvSchema.safeParse(process.env);

  if (!result.success) {
    const formattedErrors = Object.entries(result.error.format()).reduce((acc, [name, value]) => {
      if (value && '_errors' in value) {
        acc[name] = value._errors.join(', ');
      }

      return acc;
    }, {} as Record<PropertyKey, string>);

    logger.error(
      '❌ Individuals Sanctions V2 Plugin - Invalid environment variables:\n',
      formattedErrors,
    );

    throw new Error('Invalid environment variables');
  }

  return result.data;
};

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
      { type: 'path' }
    >;
    endUserId: PluginPayloadProperty<string>;
    clientId: PluginPayloadProperty<string>;
  };

  constructor({
    payload,
    ...pluginParams
  }: IApiPluginParams & { payload: IndividualsSanctionsV2Plugin['payload'] }) {
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

    // Deprecating JMESPath is in progress.
    invariant(
      (this.request?.transformers ?? []).every(
        transformer => transformer.name !== 'jmespath-transformer',
      ),
      'Individuals Sanctions V2 Plugin - JMESPath request transformers are not supported',
    );
    invariant(
      (this.response?.transformers ?? []).every(
        transformer => transformer.name !== 'jmespath-transformer',
      ),
      'Individuals Sanctions V2 Plugin - JMESPath response transformers are not supported',
    );
  }

  async invoke(context: TContext) {
    const env = validateEnv();
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
            `Individuals Sanctions V2 Plugin - no KYC information found at ${this.payload.kycInformation.value}`,
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
            `Individuals Sanctions V2 Plugin - no KYC information found at ${this.payload.kycInformation.value}`,
          );

          return kycInformation[firstKey].result.vendorResult.entity.data;
        }

        // Should never reach this point. Will reach here if error handling or validation changes.
        throw new Error(
          `Individuals Sanctions V2 Plugin - unexpected KYC information found at ${this.payload.kycInformation.value}`,
        );
      };
      const kycInformationByDataType = getKycInformationByDataType(kycInformation);

      requestPayload = {
        ...validatedPayload,
        ...kycInformationByDataType,
        callbackUrl,
      };

      logger.log('Individuals Sanctions V2 Plugin - Sending API request', {
        url,
        method: this.method,
      });

      const apiResponse = await this.makeApiRequest(url, this.method, requestPayload, {
        ...this.headers,
        Authorization: `Bearer ${env.UNIFIED_API_TOKEN}`,
      });

      logger.log('Individuals Sanctions V2 Plugin - Received response', {
        status: apiResponse.statusText,
        url,
      });

      const contentLength = apiResponse.headers.get('content-length');

      invariant(
        !contentLength || Number(contentLength) > 0,
        'Individuals Sanctions V2 Plugin - Received an empty response',
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
