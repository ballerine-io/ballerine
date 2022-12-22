import { FlowsEventsConfig, FlowsInitOptions, FlowsTranslations } from "../../../types/BallerineSDK";
import { TranslationType } from "../../contexts/translation";
import translation from '../../configuration/translation.json';
import { isUrl, mergeConfigurationWithUiPack, mergeTranslations } from '../merge-service';
import { configuration as configurationStore, IAppConfiguration, IAppConfigurationUI } from "../../contexts/configuration";
import deepmerge from "deepmerge";
import { get } from "svelte/store";
import { uiPack as uiPackStore, EUIPackTypes, packs, IUIPackTheme } from "../../ui-packs";

export let texts: TranslationType = translation;

export const appInit = async (flowName: string, overrides: FlowsInitOptions) => {
  let configuration = mergeConfigOverrides(overrides);
  configuration = await populateConfigurationByUiPack(configuration);
  configurationStore.update(() => configuration);
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
 * @description Extends provided by user configuration with selected ui pack
 * @param configuration provided user configuration
 */
const populateConfigurationByUiPack = async (configuration: IAppConfiguration) => {
  const packType = configuration.uiPack;
  if (isUrl(packType)) {
    const response = await fetch(packType as string);
    const uiPack = await response.json() as IUIPackTheme;
    uiPackStore.set(uiPack);
    return mergeConfigurationWithUiPack(configuration, uiPack);
  }
  if (!packType) {
    return mergeConfigurationWithUiPack(configuration, packs.default);
  }
  if (!Object.values(EUIPackTypes).includes(packType as EUIPackTypes)) {
    return mergeConfigurationWithUiPack(configuration, packs.default);
  }
  return mergeConfigurationWithUiPack(configuration, packs[packType as EUIPackTypes]);
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
