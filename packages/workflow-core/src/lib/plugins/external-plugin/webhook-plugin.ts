import { ApiPlugin } from './api-plugin';
import { TContext } from '../../utils/types';
import { IApiPluginParams } from './types';

export class WebhookPlugin extends ApiPlugin {
  public static pluginType = 'webhook';
  constructor(pluginParams: IApiPluginParams) {
    super(pluginParams);
  }

  // TODO: Ensure if this is intentional
  // @ts-expect-error - this does not match the interface of api plugins
  async callApi(context: TContext) {
    const requestPayload = await this.transformData(this.request.transformers, context);

    try {
      await this.makeApiRequest(this.url, this.method, requestPayload, this.headers!);
    } catch (err) {
      console.error(err);
    }

    return {};
  }
}
