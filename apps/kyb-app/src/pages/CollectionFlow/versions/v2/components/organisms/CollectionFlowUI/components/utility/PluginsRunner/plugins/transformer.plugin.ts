import { StateMachineAPI } from '@/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import jsonata from 'jsonata';
import get from 'lodash/get';
import set from 'lodash/set';

export const TRANSFORMER_PLUGIN_NAME = 'transformer';

export interface ITransformerPluginParams {
  expression: string;
  input?: string;
  output: string;
}

export const transformerPlugin = async (
  context: CollectionFlowContext,
  _: { api: StateMachineAPI },
  params: ITransformerPluginParams,
) => {
  const { expression, input, output } = params;

  const inputData = input ? get(context, input) : context;

  const jsonataExpression = jsonata(expression);
  const expressionResult = await jsonataExpression.evaluate(inputData);

  return set(context, output, expressionResult);
};
