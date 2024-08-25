import { ApiPlugin } from './api-plugin';
import { TContext } from '../../utils/types';
import { IApiPluginParams } from './types';
import { logger } from '../../logger';
import { AnyRecord, isErrorWithMessage, isObject } from '@ballerine/common';
import { alpha2ToAlpha3 } from 'i18n-iso-countries';

export class MasterCardMerchantScreeningPlugin extends ApiPlugin {
  public static pluginType = 'http';

  constructor(pluginParams: IApiPluginParams) {
    super(pluginParams);
  }

  async invoke(context: TContext) {
    let requestPayload;

    if (this.request && 'transformers' in this.request && this.request.transformers) {
      requestPayload = await this.transformData(this.request.transformers, context);

      const { isValidRequest, errorMessage } = await this.validateContent(
        this.request.schemaValidator,
        requestPayload,
        'Request',
      );

      if (!isValidRequest) {
        return this.returnErrorResponse(errorMessage!);
      }
    }

    try {
      const secrets = await this.secretsManager?.getAll?.();
      const urlWithoutPlaceholders = await this.replaceValuePlaceholders(this.url, context);
      const entity = isObject(context.entity) ? context.entity : {};
      const countrySubdivisionSupportedCountries = ['US', 'CA'] as const;
      const address = {
        line1: [
          entity?.data?.additionalInfo?.headquarters?.street,
          entity?.data?.additionalInfo?.headquarters?.streetNumber,
        ]
          .filter(Boolean)
          .join(' '),
        city: entity?.data?.additionalInfo?.headquarters?.city,
        country: alpha2ToAlpha3(entity?.data?.additionalInfo?.headquarters?.country),
        postalCode: requestPayload?.postalCode,
        countrySubdivision: countrySubdivisionSupportedCountries.includes(
          entity?.data?.additionalInfo?.headquarters?.country,
        )
          ? requestPayload?.countrySubdivision
          : undefined,
      };

      requestPayload = {
        ...requestPayload,
        consumerKey: secrets?.consumerKey,
        privateKey: secrets?.privateKey,
        acquirerId: secrets?.acquirerId,
        merchant: {
          name: entity?.data?.companyName,
          address,
        },
        principals: [
          {
            firstName: entity?.data?.additionalInfo?.mainRepresentative?.firstName,
            lastName: entity?.data?.additionalInfo?.mainRepresentative?.lastName,
            address,
          },
        ],
      };

      logger.log('API Plugin - Sending API request', {
        url: urlWithoutPlaceholders,
        method: this.method,
      });

      const apiResponse = await this.makeApiRequest(
        urlWithoutPlaceholders,
        this.method,
        requestPayload,
        await this.composeRequestHeaders(this.headers!, context),
      );

      logger.log('API Plugin - Received response', {
        status: apiResponse.statusText,
        url: urlWithoutPlaceholders,
      });

      if (apiResponse.ok) {
        const result = await apiResponse.json();
        let responseBody = result as AnyRecord;

        if (this.response?.transformers) {
          responseBody = await this.transformData(this.response.transformers, result as AnyRecord);
        }

        const { isValidResponse, errorMessage } = await this.validateContent(
          this.response!.schemaValidator,
          responseBody,
          'Response',
        );

        if (!isValidResponse) {
          return this.returnErrorResponse(errorMessage!);
        }

        if (this.successAction) {
          return this.returnSuccessResponse(this.successAction, {
            ...responseBody,
          });
        }

        return {};
      } else {
        const errorResponse = await apiResponse.json();

        return this.returnErrorResponse(
          'Request Failed: ' + apiResponse.statusText + ' Error: ' + JSON.stringify(errorResponse),
        );
      }
    } catch (error) {
      logger.error('Error occurred while sending an API request', { error });

      return this.returnErrorResponse(isErrorWithMessage(error) ? error.message : '');
    }
  }
}
