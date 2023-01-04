import { EDocumentType, IDocumentInfo } from "../contexts/app-state";
import { IAppConfiguration, IStepConfiguration, Steps } from "../contexts/configuration";
import { getFlowName } from "../contexts/flows";

export const getDocumentType = (step: IStepConfiguration, selectedDocumentInfo?: IDocumentInfo) => {
  return step.type as EDocumentType || selectedDocumentInfo?.type;
}

export const isDocumentSelectionStepExists = (configuration: IAppConfiguration) => {
  const flowName: string = getFlowName();
  const steps = configuration.flows[flowName].steps as IStepConfiguration[];
  return !!(steps.find(s => s.name === Steps.DocumentSelection));
}
