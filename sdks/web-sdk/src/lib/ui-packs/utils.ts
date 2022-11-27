import { IAppConfiguration, IAppConfigurationUI, ICSSProperties, IStepConfiguration } from "../contexts/configuration";
import { mergeStepConfig } from "../services/merge-service";
import { injectPrimaryIntoLayoutGradient } from '../services/theme-manager';
import { makeStylesFromConfiguration } from '../utils/css-utils';
import merge from 'deepmerge';

export const getStepConfiguration = (configuration:  IAppConfiguration, uiPack: IAppConfigurationUI, stepId: string) => {
  if (!uiPack.steps[stepId] && configuration.steps && configuration.steps[stepId]) {
    const step = configuration.steps[stepId];
    const uiStep = uiPack.steps[step.id];
    return mergeStepConfig(uiStep, configuration.steps[stepId]);
  }
  return mergeStepConfig(uiPack.steps[stepId], configuration.steps ? configuration.steps[stepId] : {} as IStepConfiguration);
}

export const getLayoutStyles = (configuration:  IAppConfiguration, uiPack: IAppConfigurationUI, step: IStepConfiguration) => {
  return makeStylesFromConfiguration(
    merge(
      injectPrimaryIntoLayoutGradient(uiPack.layout, configuration.general?.colors?.primary || uiPack.general.colors.primary),
      configuration.layout || {},
    ),
    step.style,
  );
}

export const getComponentStyles = (uiPackComponentStyle: ICSSProperties, configurationStyles: ICSSProperties, style: ICSSProperties) => {
  return makeStylesFromConfiguration(
    merge(uiPackComponentStyle, configurationStyles || {}),
    style,
  );
}
