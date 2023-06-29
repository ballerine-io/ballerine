import { ApiPlugin, IApiPluginParams } from './api-plugin';
import { TContext } from '../../utils/types';

export interface WebhookPluginParams {
  name: string;
  stateNames: Array<string>;
  url: string;
  method: IApiPluginParams['method'];
  headers: IApiPluginParams['headers'];
  request: Omit<IApiPluginParams['request'], 'schemaValidator'>;
}

export class WebhookPlugin extends ApiPlugin {
  constructor(pluginParams: IApiPluginParams) {
    super(pluginParams);
  }
  async callApi(context: TContext) {
    const requestPayload = await this.transformData(this.request.transformer, context);

    try {
      await this.makeApiRequest(this.url, this.method, requestPayload, this.headers);
    } catch (e) {
      console.error(e);
    }

    return {};
  }
}
