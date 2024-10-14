import { ApiPlugin, IApiPluginParams } from '.';
import { ApiBallerinePlugins, BALLERINE_API_PLUGIN_FACTORY } from './vendor-consts';
import { reqResTransformersObj } from '../../workflow-runner-utils';

export interface IBallerineApiPluginParams {
  pluginKind: ApiBallerinePlugins;
  vendor?: string;
  displayName: string | undefined;
  stateNames: string[];
}

const _getPluginOptions = (params: IBallerineApiPluginParams & IApiPluginParams) => {
  let optionsFactoryFn: any = BALLERINE_API_PLUGIN_FACTORY[params.pluginKind];

  if (!optionsFactoryFn) {
    throw new Error(`Unknown plugin kind: ${params.pluginKind}`);
  }

  const pluginOptionFactoryFn = BALLERINE_API_PLUGIN_FACTORY[params.pluginKind] as any;

  if (
    [
      'individual-sanctions',
      'company-sanctions',
      'ubo',
      'merchant-monitoring',
      'kyc-session',
      'registry-information',
    ].includes(params.pluginKind)
  ) {
    if (!params.vendor) {
      throw new Error(`Missed vendor for: ${params.pluginKind}`);
    }

    optionsFactoryFn = pluginOptionFactoryFn[params.vendor];
  }

  if (params.pluginKind === 'template-email') {
    if (!params.template) {
      throw new Error(`Missed templateName for: ${params.pluginKind}`);
    }

    optionsFactoryFn = pluginOptionFactoryFn[params.template];
  }

  if (!optionsFactoryFn) {
    throw new Error(`Unknown plugin kind: ${params.pluginKind}, params: ${JSON.stringify(params)}`);
  }

  return optionsFactoryFn(params as any);
};

export class BallerineApiPlugin extends ApiPlugin {
  public static pluginType = 'http';

  constructor(params: IBallerineApiPluginParams & IApiPluginParams) {
    const options = _getPluginOptions(params);

    const { requestTransformer, requestValidator, responseTransformer, responseValidator } =
      reqResTransformersObj({
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

  async _onReplaceVariable(variableKey: string, content: string, placeholder: string) {
    let replacedSecrets = await this.replaceBallerineVariable(variableKey, content, placeholder);

    replacedSecrets = await super._onReplaceVariable(variableKey, replacedSecrets, placeholder);

    return replacedSecrets;
  }
}
