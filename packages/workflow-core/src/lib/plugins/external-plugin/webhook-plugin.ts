import { ApiPlugin } from './api-plugin';
import { TContext } from '../../utils/types';
import { IApiPluginParams } from './types';
import { logger } from '@/lib';

export class WebhookPlugin extends ApiPlugin {
  public static pluginType = 'http';
  public static pluginKind = 'webhook';
  constructor(pluginParams: IApiPluginParams) {
    super(pluginParams);
  }

  // TODO: Ensure if this is intentional
  async invoke(context: TContext) {
    const requestPayload = await this.transformData(this.request.transformers, context);

    try {
      await this.makeApiRequest(this.url, this.method, requestPayload, this.headers!);
    } catch (err) {
      logger.error('Error occurred while sending an API request', { err });
    }

    return {};
  }
}
