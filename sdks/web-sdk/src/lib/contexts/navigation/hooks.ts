import { IAppConfiguration, IStepConfiguration } from '../configuration';
import { steps } from './constants';
import { getFlowName, getFlowOrders } from '../flows/hooks';
import { Writable } from '../../../../node_modules/svelte/types/runtime/store/index';
import { verifyDocumentsAndCloseFlow } from '../../utils/api-utils';
import { sendFlowCompleteEvent } from '../../utils/event-service';
import { sendFlowErrorEvent } from '../../utils/event-service/utils';

const filterOutByType = (flowIds: string[], configuration: IAppConfiguration, type?: string) => {
  if (!type) return flowIds;

  const flowName: string = getFlowName();
  return flowIds.filter(id => {
    const flowSteps = configuration.flows[flowName].steps as IStepConfiguration[];
    const stepConfiguration = flowSteps.find(s => s.id === id) as IStepConfiguration;
    const step = steps.find(s => s.name === stepConfiguration.name);
    return step?.type !== type;
  });
};

export const getNextStepId = (
  globalConfiguration: IAppConfiguration,
  currentStepId: string,
  skipType?: string,
) => {
  const stepsOrder = getFlowOrders(globalConfiguration) as string[];
  const filteredFlows = filterOutByType(stepsOrder, globalConfiguration, skipType);
  const currentFlowIndex = filteredFlows.findIndex(i => i === currentStepId);
  if (currentFlowIndex === filteredFlows.length - 1) {
    // end of the flow
    void verifyDocumentsAndCloseFlow(globalConfiguration).catch((err: Error) =>
      sendFlowErrorEvent(err),
    );
    sendFlowCompleteEvent();
    return;
  }
  return filteredFlows[currentFlowIndex + 1];
};

export const goToNextStep = (
  currentStepIdStore: Writable<string>,
  globalConfiguration: IAppConfiguration,
  currentStepId: string,
  skipType?: string,
) => {
  const nextStepId = getNextStepId(globalConfiguration, currentStepId, skipType);
  if (nextStepId) currentStepIdStore.set(nextStepId);
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
