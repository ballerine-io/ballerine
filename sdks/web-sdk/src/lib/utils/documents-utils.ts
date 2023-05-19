import { type IDocumentInfo } from '../contexts/app-state';
import { type IAppConfiguration, type IStepConfiguration, Steps } from '../contexts/configuration';
import { getFlowName } from '../contexts/flows';
import { type TDocumentType } from '../contexts/app-state/types';

export const getDocumentType = (step: IStepConfiguration, selectedDocumentInfo?: IDocumentInfo) => {
  return (step.type as TDocumentType) || selectedDocumentInfo?.type;
};

export const isDocumentSelectionStepExists = (configuration: IAppConfiguration) => {
  const flowName: string = getFlowName();

  const steps = configuration.flows[flowName].steps as IStepConfiguration[];
  return !!steps.find(s => s.name === Steps.DocumentSelection);
};
