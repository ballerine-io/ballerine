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
    console.log(`Constructed IterativePlugin with params: ${JSON.stringify(pluginParams)}`);
  }

  async invoke(context: TContext) {
    console.log('invoke() method called');

    const iterationParams = await this.transformData(this.iterateOn, context);

    if (!Array.isArray(iterationParams)) {
      console.error('Iterative plugin could not find iterate on param');
      // return this.composeErrorResponse('Iterative plugin could not find iterate on param');
      return {
        callbackAction: this.successAction,
        warnnings: ['Iterative plugin could not find iterate on param'],
      };
    }

    for (const param of iterationParams) {
      console.log(`Performing action for param: ${JSON.stringify(param)}`);
      await this.action(param as TContext);
    }

    console.log('All actions completed successfully');

    return { callbackAction: this.successAction };
  }

  async transformData(transformers: Transformers, record: AnyRecord) {
    console.log('transformData() method called');
    let mutatedRecord = record;

    for (const transformer of transformers) {
      mutatedRecord = await this.transformByTransformer(transformer, mutatedRecord);
    }

    return mutatedRecord;
  }

  async transformByTransformer(transformer: Transformer, record: AnyRecord) {
    console.log(
      `transformByTransformer() called for mapping: ${JSON.stringify(transformer.mapping)}`,
    );

    try {
      return (await transformer.transform(record, { input: 'json', output: 'json' })) as AnyRecord;
    } catch (error) {
      const errorMessage = `Error transforming data: ${
        isErrorWithMessage(error) ? error.message : ''
      } for transformer mapping: ${transformer.mapping}`;

      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  composeErrorResponse(errorMessage: string) {
    console.error(`Composing error response with message: ${errorMessage}`);

    return { callbackAction: this.errorAction, error: errorMessage };
  }
}
