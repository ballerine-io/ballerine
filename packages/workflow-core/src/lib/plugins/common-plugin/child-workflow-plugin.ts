import { TContext, Transformer, Transformers } from '../../utils';
import { ChildWorkflowPluginParams } from './types';
import { AnyRecord, isErrorWithMessage } from '@ballerine/common';
import { logger } from '../../logger';

export class ChildWorkflowPlugin {
  public static pluginType = 'child';
  name: ChildWorkflowPluginParams['name'];
  definitionId: ChildWorkflowPluginParams['definitionId'];
  parentWorkflowRuntimeId: ChildWorkflowPluginParams['parentWorkflowRuntimeId'];
  parentWorkflowRuntimeConfig: ChildWorkflowPluginParams['parentWorkflowRuntimeConfig'];
  stateNames: ChildWorkflowPluginParams['stateNames'];
  transformers: ChildWorkflowPluginParams['transformers'];
  action: ChildWorkflowPluginParams['action'];
  initEvent: ChildWorkflowPluginParams['initEvent'];
  successAction: ChildWorkflowPluginParams['successAction'];
  errorAction: ChildWorkflowPluginParams['errorAction'];

  constructor(pluginParams: ChildWorkflowPluginParams) {
    this.name = pluginParams.name;
    this.definitionId = pluginParams.definitionId;
    this.parentWorkflowRuntimeId = pluginParams.parentWorkflowRuntimeId;
    this.parentWorkflowRuntimeConfig = pluginParams.parentWorkflowRuntimeConfig;
    this.stateNames = pluginParams.stateNames;
    this.transformers = pluginParams.transformers;
    this.initEvent = pluginParams.initEvent;
    this.action = pluginParams.action;
    this.successAction = pluginParams.successAction;
    this.errorAction = pluginParams.errorAction;
  }

  async invoke(context: TContext) {
    logger.log(`Invoking child workflow plugin`, {
      name: this.name,
      definitionId: this.definitionId,
      parentWorkflowRuntimeId: this.parentWorkflowRuntimeId,
    });
    const childWorkflowContext = await this.transformData(this.transformers || [], context);

    try {
      await this.action({
        parentWorkflowRuntimeId: this.parentWorkflowRuntimeId,
        definitionId: this.definitionId,
        initOptions: {
          context: childWorkflowContext,
          event: this.initEvent,
          config: {
            language: this.parentWorkflowRuntimeConfig.language,
          },
        },
      });
      logger.log(`Child workflow plugin invoked`, {
        name: this.name,
        definitionId: this.definitionId,
        parentWorkflowRuntimeId: this.parentWorkflowRuntimeId,
      });
      logger.log(`Child workflow plugin completed`, {
        name: this.name,
        definitionId: this.definitionId,
        parentWorkflowRuntimeId: this.parentWorkflowRuntimeId,
      });

      return { callbackAction: this.successAction };
    } catch (error) {
      logger.error(`Error occurred while invoking child workflow plugin`, {
        error,
        name: this.name,
        definitionId: this.definitionId,
        parentWorkflowRuntimeId: this.parentWorkflowRuntimeId,
      });

      logger.log(`Child workflow plugin completed`, {
        name: this.name,
        definitionId: this.definitionId,
        parentWorkflowRuntimeId: this.parentWorkflowRuntimeId,
      });

      return { callbackAction: this.errorAction };
    }
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
}
