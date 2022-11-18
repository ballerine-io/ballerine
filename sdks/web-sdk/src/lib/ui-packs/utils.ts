import { IAppConfiguration, IAppConfigurationUI, ICSSProperties, IStepConfiguration } from "../contexts/configuration";
import { mergeStepConfig } from "../services/merge-service";
import { injectPrimaryIntoLayoutGradient } from '../services/theme-manager';
import { makeStylesFromConfiguration } from '../utils/css-utils';
import merge from 'deepmerge';

export const getStepConfiguration = (configuration:  IAppConfiguration, uiPackStep: IStepConfiguration, stepId: string) => {
  return mergeStepConfig(uiPackStep, configuration.steps ? configuration.steps[stepId] : {} as IStepConfiguration);
}

export const getLayoutStyles = (configuration:  IAppConfiguration, uiPack: IAppConfigurationUI, step: IStepConfiguration) => {
  return makeStylesFromConfiguration(
    merge(
      injectPrimaryIntoLayoutGradient(uiPack.layout, uiPack.general.colors.primary),
      configuration.layout || {},
    ),
    step.style,
  );
}

export const getComponentStyles = (uiPackComponentStyle: ICSSProperties, configuration: IAppConfiguration, style: ICSSProperties) => {
  return makeStylesFromConfiguration(
    merge(uiPackComponentStyle, configuration.iconButton || {}),
    style,
  );
}
