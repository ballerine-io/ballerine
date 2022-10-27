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
  currentStepId: Writable<string>,
  globalConfiguration: IAppConfiguration,
  skipType?: string,
) => {
  const flows = getFlowOrders(globalConfiguration) as string[];
  const filteredFlows = filterOutByType(flows, globalConfiguration, skipType);
  const currentFlowIndex = filteredFlows.findIndex(f => f === stepConfiguration.id);
  const nextFlowId = filteredFlows[currentFlowIndex + 1];
  const nextStep = globalConfiguration.steps[nextFlowId];
  console.log("nextStep", nextStep)
  if (nextStep.route) {
    currentStepId.set(nextStep.route);
  }

  const step = steps.find(s => s.name === nextStep.name);
  if (step) currentStepId.set(step.route);
};

export const goToPrevStep = (
  stepConfiguration: IStepConfiguration,
  currentStepId: Writable<string>,
  globalConfiguration: IAppConfiguration,
  skipType?: string,
) => {
  const flows = getFlowOrders(globalConfiguration) as string[];
  const filteredFlows = filterOutByType(flows, globalConfiguration, skipType);
  const currentFlowIndex = filteredFlows.findIndex(f => f === stepConfiguration.id);
  const nextFlowId = filteredFlows[currentFlowIndex - 1];
  const nextStep = globalConfiguration.steps[nextFlowId];
  if (nextStep.route) {
    return currentStepId.set(nextStep.route);
  }
  const step = steps.find(s => s.name === nextStep.name);
  if (step) return currentStepId.set(step.route);
};
