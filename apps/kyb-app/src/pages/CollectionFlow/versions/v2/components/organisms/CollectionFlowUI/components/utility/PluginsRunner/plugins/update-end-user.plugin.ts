import jsonata from 'jsonata';
import { toast } from 'sonner';

import { updateEndUser } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { StateMachineAPI } from '@/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';

export const UPDATE_END_USER_PLUGIN_NAME = 'update_end_user';

export interface IUpdateEndUserPluginParams {
  expression: string;
}

export const updateEndUserPlugin = async (
  context: CollectionFlowContext,
  _: { api: StateMachineAPI },
  { expression }: IUpdateEndUserPluginParams,
) => {
  try {
    const jsonataExpression = jsonata(expression);
    const expressionResult = await jsonataExpression.evaluate(context);

    return await updateEndUser(expressionResult);
  } catch (error) {
    toast.error('Failed to update end user using plugin.');
    console.error(error);
  }
};
