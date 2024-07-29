import { WorkflowRunner } from '../../workflow-runner';
import { ApiPlugin, IApiPluginParams } from '../external-plugin';
import { ApiBallerinePlugins, BALLERINE_API_PLUGIN_FACTORY } from './vendor-consts';

export interface IBallerineApiPluginParams {
  pluginKind: ApiBallerinePlugins;
  displayName: string | undefined;
  stateNames: string[];
}

export class BallerineApiPlugin extends ApiPlugin {
  public static pluginType = 'http';

  constructor(params: IBallerineApiPluginParams & IApiPluginParams) {
    const optionsFactoryFn = BALLERINE_API_PLUGIN_FACTORY[params.pluginKind];

    const options = optionsFactoryFn(params as any);

    let { requestTransformer, requestValidator, responseTransformer, responseValidator } =
      WorkflowRunner.reqResTransformersObj({
        params,
        ...options,
      });

    super({
      persistResponseDestination: undefined,
      ...params,
      ...options,
      request: { transformers: requestTransformer, schemaValidator: requestValidator } as any,
      response: { transformers: responseTransformer, schemaValidator: responseValidator } as any,
    });
  }
}
