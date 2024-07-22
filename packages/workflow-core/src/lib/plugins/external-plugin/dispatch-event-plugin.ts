import { IDispatchEventPluginParams } from './types';
import { WorkflowRunner } from '../../../lib/workflow-runner';
import { Transformer, Transformers } from '../../../lib/utils';
import { AnyRecord, isErrorWithMessage } from '@ballerine/common';

type WorkflowFetchTransformers = typeof WorkflowRunner.fetchTransformers;

export type IDispatchEventPluginParamsWithTransfomers = Omit<
  IDispatchEventPluginParams,
  'transformers'
> & {
  transformers: ReturnType<WorkflowFetchTransformers>;
};

export class DispatchEventPlugin implements IDispatchEventPluginParams {
  name: string;
  eventName: string;
  payload?: AnyRecord;
  stateNames: string[];
  errorAction?: string;
  successAction?: string;
  transformers: any;
  displayName: string | undefined;

  constructor(pluginParams: IDispatchEventPluginParamsWithTransfomers) {
    this.name = pluginParams.name;
    this.payload = pluginParams.payload;
    this.eventName = pluginParams.eventName;
    this.stateNames = pluginParams.stateNames;
    this.errorAction = pluginParams.errorAction;
    this.displayName = pluginParams.displayName;
    this.transformers = pluginParams.transformers;
    this.successAction = pluginParams.successAction;
  }

  async getPluginEvent(record: AnyRecord) {
    return {
      eventName: this.eventName,
      event: {
        type: this.eventName,
        payload: await this.__transformData(this.transformers || [], {
          ...record,
          ...this.payload,
        }),
        state: this.stateNames[0] ?? '',
      },
    };
  }

  private async __transformData(transformers: Transformers, record: AnyRecord) {
    let mutatedRecord = record;

    for (const transformer of transformers) {
      mutatedRecord = await this.__transformByTransformer(transformer, mutatedRecord);
    }

    return mutatedRecord;
  }

  private async __transformByTransformer(transformer: Transformer, record: AnyRecord) {
    try {
      return (await transformer.transform(record, { input: 'json', output: 'json' })) as AnyRecord;
    } catch (error) {
      throw new Error(
        `Error transforming data: ${
          isErrorWithMessage(error) ? error.message : ''
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        } for transformer mapping: ${JSON.stringify(transformer.mapping)}`,
      );
    }
  }
}
