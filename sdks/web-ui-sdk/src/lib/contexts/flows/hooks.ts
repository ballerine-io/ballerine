import { IAppConfiguration } from '../configuration';
import { IFlow } from './types';

const FLOW_STORE_KEY = 'flow';

export const setFlowName = (flows: { [key: string]: IFlow }, name: string | null) => {
  if (name && flows[name]) return sessionStorage.setItem(FLOW_STORE_KEY, name);

  const savedFlow = sessionStorage.getItem(FLOW_STORE_KEY);

  if (!savedFlow || !flows[savedFlow]) sessionStorage.setItem(FLOW_STORE_KEY, 'default');
};

export const getFlowName = (): string => sessionStorage.getItem(FLOW_STORE_KEY) || 'default';

export const getFlowOrders = (configuration: IAppConfiguration) => {
  const flowName = sessionStorage.getItem(FLOW_STORE_KEY);
  if (!flowName) {
    return new Error("Flow name wasn't provided");
  }
  const flowConfiguration = configuration.flows[flowName];
  if (!flowConfiguration || !flowConfiguration.steps) {
    return new Error(`Flow configuration doesn't exist for the name: ${flowName}`);
  }
  return flowConfiguration.steps.map(s => s.id);
};

export const getFlowConfig = (configuration: IAppConfiguration): IFlow => {
  const flowName = sessionStorage.getItem(FLOW_STORE_KEY);

  if (!flowName) {
    throw new Error("Flow name wasn't provided");
  }

  const flowConfiguration = configuration.flows[flowName];

  if (!flowConfiguration) {
    throw new Error(`Flow configuration doesn't exist for the name: ${flowName}`);
  }

  return flowConfiguration;
};

export const isNativeCamera = (configuration: IAppConfiguration): boolean => {
  const flowName = sessionStorage.getItem(FLOW_STORE_KEY) as string;
  const flowConfiguration = configuration.flows[flowName];
  return !!flowConfiguration?.mobileNativeCamera;
};
