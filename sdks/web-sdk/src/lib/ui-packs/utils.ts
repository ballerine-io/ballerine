import type { IAppConfiguration, IStepConfiguration } from '../contexts/configuration';
import { injectPrimaryIntoLayoutGradient } from '../services/theme-manager';
import { type ICSSProperties, makeStylesFromConfiguration } from '../services/css-manager';
import { getFlowName } from '../contexts/flows';

export const getStepConfiguration = (configuration: IAppConfiguration, stepId: string) => {
  const flowName: string = getFlowName();
  const steps = configuration.flows[flowName].steps as IStepConfiguration[];
  return steps.find(step => step.id === stepId) as IStepConfiguration;
};

export const getLayoutStyles = (configuration: IAppConfiguration, step: IStepConfiguration) => {
  return makeStylesFromConfiguration(
    injectPrimaryIntoLayoutGradient(
      configuration.components?.layout || {},
      configuration.general?.colors?.primary as string,
    ),
    step.style,
  );
};

export const getComponentStyles = (configurationStyles: ICSSProperties, style: ICSSProperties) => {
  return makeStylesFromConfiguration(configurationStyles || {}, style);
};
