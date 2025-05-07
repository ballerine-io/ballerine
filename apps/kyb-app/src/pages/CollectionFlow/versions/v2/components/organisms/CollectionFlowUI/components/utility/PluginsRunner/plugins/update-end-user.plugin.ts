import jsonata from 'jsonata';

import { updateEndUser, UpdateEndUserPluginDataSchema } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { StateMachineAPI } from '@/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';

export const UPDATE_END_USER_PLUGIN_NAME = 'update_end_user';

export interface IUpdateEndUserPluginParams {
  expression?: string;
}

const DEFAULT_EXPRESSION = `{
  "firstName": entity.data.additionalInfo.mainRepresentative.firstName,
  "lastName": entity.data.additionalInfo.mainRepresentative.lastName,
  "email": entity.data.additionalInfo.mainRepresentative.email,
  "phone": entity.data.additionalInfo.mainRepresentative.phone,
  "dateOfBirth": entity.data.additionalInfo.mainRepresentative.dateOfBirth,
  "additionalInfo": {
    "title": entity.data.additionalInfo.mainRepresentative.additionalInfo.jobTitle
  }
}`;

export const updateEndUserPlugin = async (
  context: CollectionFlowContext,
  _: { api: StateMachineAPI },
  { expression = DEFAULT_EXPRESSION }: IUpdateEndUserPluginParams = {},
) => {
  try {
    const jsonataExpression = jsonata(expression);
    const expressionResult = await jsonataExpression.evaluate(context);

    const result = UpdateEndUserPluginDataSchema.safeParse(expressionResult);

    if (!result.success) {
      console.error(`Invalid ${UPDATE_END_USER_PLUGIN_NAME} plugin data`, result.error);

      return context;
    }

    await updateEndUser(result.data);

    return context;
  } catch (error) {
    console.error('Failed to update end user.', error);
  }
};
