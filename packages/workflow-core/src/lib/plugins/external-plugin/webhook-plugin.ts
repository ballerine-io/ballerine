import { ApiPlugin } from './api-plugin';
import { TContext } from '../../utils/types';
import { IApiPluginParams } from './types';
import { logger } from '../../logger';
import { AnyRecord } from '@ballerine/common';

export class WebhookPlugin extends ApiPlugin {
  public static pluginType = 'http';
  constructor(pluginParams: IApiPluginParams) {
    super(pluginParams);
  }

  // TODO: Ensure if this is intentional
  async invoke(context: TContext) {
    let requestPayload;

    if (this.request && 'transformers' in this.request && this.request.transformers) {
      requestPayload = await this.transformData(this.request.transformers, context);
    }

    try {
      const urlWithoutPlaceholders = await this.replaceValuePlaceholders(this.url, context);

      logger.log('Webhook Plugin - Sending API request', {
        url: urlWithoutPlaceholders,
        method: this.method,
      });

      const apiResponse = await this.makeApiRequest(
        urlWithoutPlaceholders,
        this.method,
        requestPayload,
        await this.composeRequestHeaders(this.headers!, context),
      );

      logger.log('Webhook Plugin - Received response', {
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
    } catch (err) {
      logger.error('Error occurred while sending an API request', { err });
    }

    return {};
  }
}
