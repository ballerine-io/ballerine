import { ApiPlugin } from './api-plugin';
import { TContext } from '../../utils/types';
import { IApiPluginParams } from './types';

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
      console.error(err);
    }

    return { invokedAt: Date.now() };
  }
}
