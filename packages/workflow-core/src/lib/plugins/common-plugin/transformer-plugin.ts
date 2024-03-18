import { ISerializableMappingPluginParams } from '../../plugins/common-plugin/types';
import { SerializableValidatableTransformer } from '../../plugins/external-plugin';
import { HelpersTransformer, TContext, THelperFormatingLogic } from '../../utils';
import { logger } from '../../logger';

export interface HelpersTransformerParams {
  mapping: THelperFormatingLogic;
}

export type TransformerPluginTransformersType = 'helpers-transformer';
export type TransformerPluginTransformersParams = SerializableValidatableTransformer;

export interface TransformerPluginParams {
  name: string;
  stateNames: string[];
  transformers: { transformer: string; mapping: string | THelperFormatingLogic }[];
}

export class TransformerPlugin implements ISerializableMappingPluginParams {
  public static pluginType = 'transformer';
  public name: string;
  stateNames: string[];
  transformers: { transformer: string; mapping: string | THelperFormatingLogic }[];

  constructor(params: TransformerPluginParams) {
    this.name = params.name;
    this.transformers = params.transformers;
    this.stateNames = params.stateNames;
  }

  async invoke(context: TContext) {
    logger.log('invoke() method called');

    for (const transformParams of this.transformers) {
      const transformer = this.createTransformer(
        transformParams.transformer,
        transformParams.mapping,
      );

      transformer.transform(context);
    }

    logger.log('Transform performed successfully.');
    return {};
  }

  private createTransformer(transformerType: string, params: unknown) {
    if (transformerType === 'helpers') {
      return new HelpersTransformer(
        //@ts-ignore
        params,
      );
    }

    throw new Error(`Transformer ${transformerType} is not supported.`);
  }

  static isTransformerPluginParams(params: unknown): params is TransformerPluginParams {
    if (typeof params === 'object') {
      //@ts-ignore
      return params?.pluginKind === 'transformer';
    }

    return false;
  }
}
