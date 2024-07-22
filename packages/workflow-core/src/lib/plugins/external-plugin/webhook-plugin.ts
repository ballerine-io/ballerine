import { ApiPlugin } from './api-plugin';
import { TContext, Transformers } from '../../utils/types';
import { IApiPluginParams } from './types';
import { logger } from '../../logger';

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
      return await this.makeApiRequest(this.url, this.method, requestPayload, this.headers!);
    } catch (err) {
      logger.error('Error occurred while sending an API request', { err });
    }

    return {};
  }
}
