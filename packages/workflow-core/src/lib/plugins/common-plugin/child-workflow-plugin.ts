import { TContext, Transformer, Transformers } from '../../utils';
import { ChildWorkflowPluginParams } from './types';
import { AnyRecord, isErrorWithMessage } from '@ballerine/common';

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

  constructor(pluginParams: ChildWorkflowPluginParams) {
    this.name = pluginParams.name;
    this.definitionId = pluginParams.definitionId;
    this.parentWorkflowRuntimeId = pluginParams.parentWorkflowRuntimeId;
    this.parentWorkflowRuntimeConfig = pluginParams.parentWorkflowRuntimeConfig;
    this.stateNames = pluginParams.stateNames;
    this.transformers = pluginParams.transformers;
    this.initEvent = pluginParams.initEvent;
    this.action = pluginParams.action;
  }

  async invoke(context: TContext) {
    const childWorkflowContext = await this.transformData(this.transformers || [], context);

    void this.action({
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

    return Promise.resolve();
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
