import { AnyRecord, isErrorWithMessage, isObject } from '@ballerine/common';
import { alpha2ToAlpha3 } from 'i18n-iso-countries';
import { logger } from '../../logger';
import { TContext } from '../../utils/types';
import { ApiPlugin } from './api-plugin';
import { IApiPluginParams } from './types';
import { State } from 'country-state-city';

export class MastercardMerchantScreeningPlugin extends ApiPlugin {
  public static pluginType = 'http';

  constructor(pluginParams: IApiPluginParams) {
    super({
      ...pluginParams,
      method: 'POST' as const,
    });
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
      const url = `${process.env.UNIFIED_API_URL}/merchant-screening/mastercard`;
      const entity = isObject(context.entity) ? context.entity : {};
      const countrySubdivisionSupportedCountries = ['US', 'CA'] as const;
      const statesOfCountry = State.getStatesOfCountry(entity?.data?.address?.country);
      const address = {
        line1: [entity?.data?.address?.street, entity?.data?.address?.streetNumber]
          .filter(Boolean)
          .join(' '),
        city: entity?.data?.address?.city || 'Singapore',
        country: alpha2ToAlpha3(entity?.data?.address?.country),
        postalCode: entity?.data?.address?.postalCode,
        countrySubdivision: countrySubdivisionSupportedCountries.includes(
          entity?.data?.address?.country,
        )
          ? statesOfCountry.find(
              state => state.name.toLowerCase() === entity?.data?.address?.state?.toLowerCase(),
            )?.isoCode
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

      logger.log('Mastercard Merchant Screening Plugin - Sending API request', {
        url,
        method: this.method,
      });

      const apiResponse = await this.makeApiRequest(url, this.method, requestPayload, {
        ...this.headers,
        Authorization: `Bearer ${process.env.UNIFIED_API_TOKEN}`,
      });

      logger.log('Mastercard Merchant Screening Plugin - Received response', {
        status: apiResponse.statusText,
        url,
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
