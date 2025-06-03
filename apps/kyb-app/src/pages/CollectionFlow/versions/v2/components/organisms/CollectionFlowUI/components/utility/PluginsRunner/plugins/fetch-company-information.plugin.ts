import jsonata from 'jsonata';
import get from 'lodash/get';
import set from 'lodash/set';

import { StateMachineAPI } from '@/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import {
  fetchCompanyInformation,
  FetchCompanyInformationPluginDataSchema,
  FetchCompanyInformationResultSchema,
} from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import merge from 'lodash/merge';

export const FETCH_COMPANY_INFORMATION_PLUGIN_NAME = 'fetch_company_information';

export interface IFetchCompanyInformationPluginParams {
  expression?: string;
  output?: string;
}

const DEFAULT_EXPRESSION = `{
  "registrationNumber": entity.data.registrationNumber,
  "countryCode": entity.data.country,
  "state": entity.data.additionalInfo.state,
  "vendor": 'open-corporates'
}`;

const DEFAULT_OUTPUT = 'entity.data';

export const fetchCompanyInformationPlugin = async (
  context: CollectionFlowContext,
  _: { api: StateMachineAPI },
  {
    expression = DEFAULT_EXPRESSION,
    output = DEFAULT_OUTPUT,
  }: IFetchCompanyInformationPluginParams = {},
) => {
  try {
    const jsonataExpression = jsonata(expression);
    const expressionResult = await jsonataExpression.evaluate(context);

    const pluginData = FetchCompanyInformationPluginDataSchema.safeParse(expressionResult);

    if (!pluginData.success) {
      console.error(
        `Invalid ${FETCH_COMPANY_INFORMATION_PLUGIN_NAME} plugin data`,
        pluginData.error,
      );

      return context;
    }

    const pluginResult = await fetchCompanyInformation(pluginData.data);

    const validatedResult = FetchCompanyInformationResultSchema.safeParse(pluginResult);

    if (!validatedResult.success) {
      console.error(
        `Invalid ${FETCH_COMPANY_INFORMATION_PLUGIN_NAME} plugin result`,
        validatedResult.error,
      );

      return context;
    }

    const existingData = get(context, output, {});
    const mergeResult = merge(existingData, validatedResult.data);

    const result = set(context, output, mergeResult);

    return result;
  } catch (error) {
    console.error('Failed to fetch company information.', error);

    return context;
  }
};
