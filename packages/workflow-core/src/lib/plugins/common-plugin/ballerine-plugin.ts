import { WorkflowRunner } from '../../workflow-runner';
import { ApiPlugin, IApiPluginParams } from '../external-plugin';
import { ApiBallerinePlugins, BALLERINE_API_PLUGIN_FACTORY } from './vendor-consts';

export interface IBallerineApiPluginParams {
  pluginKind: ApiBallerinePlugins;
  vendor?: string;
  displayName: string | undefined;
  stateNames: string[];
}

export class BallerineApiPlugin extends ApiPlugin {
  public static pluginType = 'http';

  constructor(params: IBallerineApiPluginParams & IApiPluginParams) {
    let optionsFactoryFn: any = BALLERINE_API_PLUGIN_FACTORY[params.pluginKind];

    if (!optionsFactoryFn) {
      throw new Error(`Unknown plugin kind: ${params.pluginKind}`);
    }

    if (params.pluginKind === 'individual-sanctions' || params.pluginKind === 'company-sanctions') {
      if (!params.vendor) {
        throw new Error(`Missed vendor for: ${params.pluginKind}`);
      }

      optionsFactoryFn = (optionsFactoryFn as any)[params.vendor];
    }

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
