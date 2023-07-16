import { TContext, Transformer, Transformers } from '../../utils';
import { IterativePluginParams } from './types';
import { AnyRecord, isErrorWithMessage } from '@ballerine/common';

export class IterativePlugin {
  public static pluginType = 'iterative';
  name: IterativePluginParams['name'];
  stateNames: IterativePluginParams['stateNames'];
  iterateOn: IterativePluginParams['iterateOn'];
  action: IterativePluginParams['action'];
  successAction?: IterativePluginParams['successAction'];
  errorAction?: IterativePluginParams['errorAction'];

  constructor(pluginParams: IterativePluginParams) {
    this.name = pluginParams.name;
    this.stateNames = pluginParams.stateNames;
    this.iterateOn = pluginParams.iterateOn;
    this.action = pluginParams.action;
    this.successAction = pluginParams.successAction;
    this.errorAction = pluginParams.errorAction;
  }
  async invoke(context: TContext) {
    const iterationParams = await this.transformData(this.iterateOn, context);
    if (!Array.isArray(iterationParams))
      return this.composeErrorResponse('Iterative plugin could not find iterate on param');

    for (const param of iterationParams) {
      await this.action(param as TContext);
    }
    return { callbackAction: this.successAction };
  }

  async transformData(transformers: Transformers, record: AnyRecord) {
    let mutatedRecord = record;
    for (const transformer of transformers) {
      mutatedRecord = await this.transformByTransformer(transformer, mutatedRecord);
    }
    return mutatedRecord;
  }

  async transformByTransformer(transformer: Transformer, record: AnyRecord) {
    try {
      return (await transformer.transform(record, { input: 'json', output: 'json' })) as AnyRecord;
    } catch (error) {
      throw new Error(
        `Error transforming data: ${
          isErrorWithMessage(error) ? error.message : ''
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        } for transformer mapping: ${transformer.mapping}`,
      );
    }
  }

  composeErrorResponse(errorMessage: string) {
    return { callbackAction: this.errorAction, error: errorMessage };
  }
}
