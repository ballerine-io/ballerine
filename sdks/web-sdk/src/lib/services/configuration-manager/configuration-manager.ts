import { FlowsEventsConfig, FlowsInitOptions, FlowsTranslations } from "../../../types/BallerineSDK";
import { TranslationType } from "../../contexts/translation";
import translation from '../../configuration/translation.json';
import { mergeTranslations } from '../merge-service';
import { configuration as configurationStore, IAppConfiguration } from "../../contexts/configuration";
import deepmerge from "deepmerge";
import { get } from "svelte/store";

export let texts: TranslationType = translation;

export const appInit = (overrides: FlowsInitOptions) => {
  const configuration = mergeConfigOverrides(overrides);
  console.log("configuration", configuration);
}

/**
 * @description Merges default configuration a  nd overrides provided by the user
 * Updates store with merged configuration
 * @param overrides configuration provided by the user
 */
const mergeConfigOverrides = (overrides: FlowsInitOptions): IAppConfiguration => {
  let mergedConfiguration = get(configurationStore);
  configurationStore.update(configuration => {
    if (!overrides.uiConfig) return configuration;
    mergedConfiguration = deepmerge(configuration, overrides.uiConfig) as IAppConfiguration;
    return mergedConfiguration;
  });
  return mergedConfiguration;
}

/**
 * @description Sets flow callbacks from the configuration to the selected flow config
 * @param flowName selected flow
 * @param callbacks callbacks to set
 */
export const setFlowCallbacks = (flowName: string, callbacks?: FlowsEventsConfig) => {
  return configurationStore.update(configuration => {
    if (!callbacks) return configuration;
    return {
      ...configuration,
      flows: {
        ...configuration.flows,
        [flowName]: {
          ...configuration.flows[flowName],
          callbacks
        }
      }
    }
  })
}

/**
 * @description Merges the default translations with the translations provided by the user
 * @param translations translation overrides provided by the user
 */
export const mergeTranslationsOverrides = async (translations?: FlowsTranslations) => {
  if (!translations) return texts;
  texts = await mergeTranslations(texts, translations);
  return texts;
};
