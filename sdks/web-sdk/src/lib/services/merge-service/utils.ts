import deepmerge from 'deepmerge';
import merge from 'deepmerge';
import { FlowsTranslations } from '../../../types/BallerineSDK';
import { IAppConfiguration, IConfigurationComponents, IElement, IStepConfiguration } from '../../contexts/configuration';
import { IFlow } from '../../contexts/flows';
import { TranslationType } from '../../contexts/translation';
import { IUIPackTheme } from '../../ui-packs/types';

export const mergeStepConfig = (
  defaultConfig: IStepConfiguration,
  overrides: IStepConfiguration,
): IStepConfiguration => {
  const mergedConfig = merge(defaultConfig, overrides);
  return {
    ...mergedConfig,
    elements: overrides.elements || defaultConfig.elements,
    namespace: mergedConfig.namespace || mergedConfig.id || mergedConfig.name,
  };
};

export const isUrl = (url?: string) => {
  if (!url) return false;
  const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(url);
}

/**
 * @description Merges the default translations with the
 * @param original default app translations
 * @param overridesTranslationConfiguration translation configuration provided by the user
 */
export const mergeTranslations = async (original: TranslationType, overridesTranslationConfiguration: FlowsTranslations): Promise<TranslationType> => {
  // When overrides provided by the user in the configuration
  if (overridesTranslationConfiguration.overrides) {
    return deepmerge(original, overridesTranslationConfiguration.overrides);
  }
  // When remote url provided by the user
  if (overridesTranslationConfiguration.remoteUrl) {
    try {
      const response = await fetch(overridesTranslationConfiguration.remoteUrl);
      const overrides = (await response.json()) as TranslationType;
      return deepmerge(original, overrides);
    } catch (error) {
      console.error(error);
    }
  }
  return original;
};

/**
 * @description Merges configuration flows and components with uiPack
 * @param configuration provided user configuration
 * @param uiTheme selected default ui theme
 */
export const mergeConfigurationWithUiPack = (configuration: IAppConfiguration, uiTheme: IUIPackTheme) => {
  let flows: IFlow = {};
  Object.keys(configuration.flows).map((flowName) => {
    const flow = mergeConfigurationFlowsWithUiPack(flowName, configuration, uiTheme);
    flows = {
      ...flows,
      [flowName]: flow
    }
  });
  return {
    ...configuration,
    components: mergeComponents(uiTheme.components, configuration.components),
    flows,
  }
}

/**
 * @description Merges particular flow with uiPack
 * @param flowName current flow name
 * @param configuration provided user configuration
 * @param uiTheme selected default ui theme
 */
const mergeConfigurationFlowsWithUiPack = (flowName: string, configuration: IAppConfiguration, uiTheme: IUIPackTheme): IFlow => {
  const flowSteps = configuration.flows[flowName].steps;
  let steps: IStepConfiguration[] = uiTheme.steps;
  if (flowSteps) {
    steps = flowSteps.map(flowStep => {
      const themeStep = uiTheme.steps.find(s => s.id === flowStep.id);
      if (!themeStep) {
        throw new Error(`Invalid step id provided: ${flowStep.id as string}`);
      }
      return {
        ...themeStep,
        elements: mergeStepElements(themeStep.elements, flowStep.elements as RecursivePartial<IElement>[] | undefined)
      }
    })
  }

  return {
    ...configuration.flows[flowName],
    steps
  }
}

/**
 * @description Merges components configuration with ui theme configuration
 * @param uiThemeComponents theme components configuration
 * @param configurationComponents components configuration provided by user
 */
const mergeComponents = (
  uiThemeComponents: IConfigurationComponents,
  configurationComponents?: IConfigurationComponents
): IConfigurationComponents => {
  if (!configurationComponents) return uiThemeComponents;
  return deepmerge(uiThemeComponents, configurationComponents);
}

/**
 * @description Merges ui theme configuration with provided by user configuration
 * @param uiThemeElements theme elements configuration
 * @param configurationElements elements configuration provided by user
 */
const mergeStepElements = (uiThemeElements: IElement[], configurationElements?: RecursivePartial<IElement>[]) => {
  if (!configurationElements) return uiThemeElements;
  return uiThemeElements.map(uiThemeElement => {
    const configurationElement = configurationElements.find(e => e.id === uiThemeElement.id);
    if (configurationElement) {
      return deepmerge(uiThemeElement, configurationElement);
    }
    return uiThemeElement;
  })
}
