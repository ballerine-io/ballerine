import { TContext, Transformer, Transformers } from '../../utils';
import { IterativePluginParams } from './types';
import { AnyRecord, isErrorWithMessage } from '@ballerine/common';
import { logger } from '../../logger';

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

    logger.log(`Constructed IterativePlugin`, { ...pluginParams });
  }

  async invoke(context: TContext) {
    logger.log('invoke() method called');

    const iterationParams = await this.transformData(this.iterateOn, context);

    if (!Array.isArray(iterationParams)) {
      logger.error('Iterative plugin could not find iterate on param');
      // return this.composeErrorResponse('Iterative plugin could not find iterate on param');
      return {
        callbackAction: this.successAction,
        warnnings: ['Iterative plugin could not find iterate on param'],
      };
    }

    for (const param of iterationParams) {
      logger.log(`Performing action for param`, { param });
      await this.action(param as TContext);
    }

    logger.log('All actions completed successfully');

    return { callbackAction: this.successAction };
  }

  async transformData(transformers: Transformers, record: AnyRecord) {
    logger.log('transformData() method called');
    let mutatedRecord = record;

    for (const transformer of transformers) {
      mutatedRecord = await this.transformByTransformer(transformer, mutatedRecord);
    }

    return mutatedRecord;
  }

  async transformByTransformer(transformer: Transformer, record: AnyRecord) {
    logger.log(`transformByTransformer() called for mapping`, { mapping: transformer.mapping });

    try {
      return (await transformer.transform(record, { input: 'json', output: 'json' })) as AnyRecord;
    } catch (error) {
      const errorMessage = `Error transforming data: ${
        isErrorWithMessage(error) ? error.message : ''
      } for transformer mapping: ${transformer.mapping}`;

      logger.error('Error transformating data', {
        mapping: transformer.mapping,
        ...(isErrorWithMessage(error) && { errorMessage: error.message }),
      });
      throw new Error(errorMessage);
    }
  }

  composeErrorResponse(errorMessage: string) {
    logger.error(`Composing error response with message`, { errorMessage });

    return { callbackAction: this.errorAction, error: errorMessage };
  }
}
