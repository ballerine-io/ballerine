import { IAppConfiguration, IStepConfiguration } from '../configuration';
import { steps } from './constants';
import { getFlowOrders } from '../flows/hooks';
import { Writable } from '../../../../node_modules/svelte/types/runtime/store/index';

const filterOutByType = (flowIds: string[], configuration: IAppConfiguration, type?: string) => {
  if (!type) return flowIds;
  return flowIds.filter(id => {
    const stepConfiguration = configuration.steps[id];
    const step = steps.find(s => s.name === stepConfiguration.name);
    return step?.type !== type;
  });
};

export const addCloseToURLParams = () => {
  const url = new URL(window.location.href);
  url.searchParams.set('close', 'true');
  history.pushState('', '', url.search);
};

export const goToNextStep = (
  stepConfiguration: IStepConfiguration,
  currentStepRoute: Writable<string>,
  globalConfiguration: IAppConfiguration,
  skipType?: string,
) => {
  const flows = getFlowOrders(globalConfiguration) as string[];
  const filteredFlows = filterOutByType(flows, globalConfiguration, skipType);
  const currentFlowIndex = filteredFlows.findIndex(f => f === stepConfiguration.id);
  const nextFlowId = filteredFlows[currentFlowIndex + 1];
  const nextStep = globalConfiguration.steps[nextFlowId];

  if (nextStep.route) {
    currentStepRoute.set(nextStep.route);
  }

  const step = steps.find(s => s.name === nextStep.name);
  if (step) currentStepRoute.set(step.route);
};

export const goToPrevStep = (
  stepConfiguration: IStepConfiguration,
  currentStepRoute: Writable<string>,
  globalConfiguration: IAppConfiguration,
  skipType?: string,
) => {
  const flows = getFlowOrders(globalConfiguration) as string[];
  const filteredFlows = filterOutByType(flows, globalConfiguration, skipType);
  const currentFlowIndex = filteredFlows.findIndex(f => f === stepConfiguration.id);
  const nextFlowId = filteredFlows[currentFlowIndex - 1];
  const nextStep = globalConfiguration.steps[nextFlowId];
  if (nextStep.route) {
    return currentStepRoute.set(nextStep.route);
  }
  const step = steps.find(s => s.name === nextStep.name);
  if (step) return currentStepRoute.set(step.route);
};
