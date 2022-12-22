import { IAppConfiguration, IAppConfigurationUI, IStepConfiguration } from "../contexts/configuration";
import { mergeStepConfig } from "../services/merge-service";
import { injectPrimaryIntoLayoutGradient } from '../services/theme-manager';
import { makeStylesFromConfiguration, ICSSProperties } from '../services/css-manager';
import merge from 'deepmerge';
import { getContext } from "svelte";

export const getStepConfiguration = (configuration:  IAppConfiguration, stepId: string) => {
  const flowName = getContext("flowName");
  return configuration.flows[flowName].steps.find(step => step.id === stepId);
}

export const getLayoutStyles = (configuration:  IAppConfiguration, uiPack: IAppConfigurationUI, step: IStepConfiguration) => {
  return makeStylesFromConfiguration(
    merge(
      injectPrimaryIntoLayoutGradient(configuration.general?.colors?.primary || uiPack.general.colors.primary),
      configuration.components.layout || {},
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
