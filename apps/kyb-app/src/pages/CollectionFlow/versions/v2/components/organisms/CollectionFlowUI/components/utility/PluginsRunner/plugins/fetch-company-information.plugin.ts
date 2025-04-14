import jsonata from 'jsonata';

import {
  fetchCompanyInformation,
  FetchCompanyInformationPluginDataSchena,
} from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { StateMachineAPI } from '@/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';

export const FETCH_COMPANY_INFORMATION_PLUGIN_NAME = 'fetch_company_information';

export interface IFetchCompanyInformationPluginParams {
  expression?: string;
  output?: string;
}

const DEFAULT_EXPRESSION = `{
}`;

export const fetchCompanyInformationPlugin = async (
  context: CollectionFlowContext,
  _: { api: StateMachineAPI },
  { expression = DEFAULT_EXPRESSION, output }: IFetchCompanyInformationPluginParams,
) => {
  try {
    const jsonataExpression = jsonata(expression);
    const expressionResult = await jsonataExpression.evaluate(context);

    const result = FetchCompanyInformationPluginDataSchena.safeParse(expressionResult);

    if (!result.success) {
      console.error(`Invalid ${FETCH_COMPANY_INFORMATION_PLUGIN_NAME} plugin data`, result.error);

      return;
    }

    return await fetchCompanyInformation(result.data);
  } catch (error) {
    console.error('Failed to fetch company information.', error);
  }
};
