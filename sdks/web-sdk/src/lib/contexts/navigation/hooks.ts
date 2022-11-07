import { IAppConfiguration, IStepConfiguration } from '../configuration';
import { steps } from './constants';
import { getFlowOrders } from '../flows/hooks';
import { Writable } from '../../../../node_modules/svelte/types/runtime/store/index';
import { debug } from 'svelte/internal';

const filterOutByType = (flowIds: string[], configuration: IAppConfiguration, type?: string) => {
  if (!type) return flowIds;
  return flowIds.filter(id => {
    const stepConfiguration = configuration.steps[id];
    const step = steps.find(s => s.name === stepConfiguration.name);
    return step?.type !== type;
  });
};

export const goToNextStep = (
  currentStepIdStore: Writable<string>,
  globalConfiguration: IAppConfiguration,
  currentStepId: string,
  skipType?: string,
) => {
  const stepsOrder = getFlowOrders(globalConfiguration) as string[];
  const filteredFlows = filterOutByType(stepsOrder, globalConfiguration, skipType);
  const currentFlowIndex = filteredFlows.findIndex(i => i === currentStepId);
  if (currentFlowIndex === filteredFlows.length) {
    throw Error('Error moving next step, this is the last step');
  }
  currentStepIdStore.set(filteredFlows[currentFlowIndex + 1]);
};

export const goToPrevStep = (
  currentStepIdStore: Writable<string>,
  globalConfiguration: IAppConfiguration,
  currentStepId: string,
  skipType?: string,
) => {
  const flows = getFlowOrders(globalConfiguration) as string[];
  const filteredFlows = filterOutByType(flows, globalConfiguration, skipType);
  const currentFlowIndex = filteredFlows.findIndex(i => i === currentStepId);
  if (currentFlowIndex === 0) {
    throw Error('Error moving step back, this is the first step');
  }
  currentStepIdStore.set(filteredFlows[currentFlowIndex - 1]);
};
