import {
  FlowsEventsConfig,
  FlowsInitOptions,
  FlowsTranslations,
} from '../../../types/BallerineSDK';
import { TranslationType } from '../../contexts/translation';
import translation from '../../configuration/translation.json';
import { isUrl, mergeConfigurationWithUiPack, mergeTranslations } from '../merge-service';
import {
  configuration as configurationStore,
  IAppConfiguration,
  IStepConfiguration,
  Steps,
} from '../../contexts/configuration';
import deepmerge from 'deepmerge';
import { get } from 'svelte/store';
import { IUIPackTheme, packs, uiPack as uiPackStore } from '../../ui-packs';
import { preloadStepImages } from '../preload-service/utils';
import { IFlow } from '../../contexts/flows';
import { TUIPackType, UIPackTypes } from '../../ui-packs/types';

export let texts: TranslationType = translation;

export const appInit = async (overrides: FlowsInitOptions) => {
  let configuration = mergeConfigOverrides(overrides);
  configuration = await populateConfigurationByUiPack(configuration);
  configuration = await preloadFlowBasicSteps(configuration);
  configurationStore.update(() => configuration);
};

/**
 * @description Merges default configuration and overrides provided by the user
 * Updates store with merged configuration
 * @param overrides configuration provided by the user
 */
export const mergeConfigOverrides = (overrides: FlowsInitOptions): IAppConfiguration => {
  let mergedConfiguration = get(configurationStore);
  configurationStore.update(configuration => {
    const { uiConfig, ...restConfig } = overrides;
    mergedConfiguration = deepmerge(configuration, restConfig) as IAppConfiguration;
    if (uiConfig) {
      mergedConfiguration = deepmerge(mergedConfiguration, uiConfig) as IAppConfiguration;
    }
    return mergedConfiguration;
  });
  return mergedConfiguration;
};

/**
 * @description Extends provided by user configuration with selected ui pack
 * @param configuration provided user configuration
 */
export const populateConfigurationByUiPack = async (
  configuration: IAppConfiguration,
): Promise<IAppConfiguration> => {
  const packType = configuration.uiPack;
  if (isUrl(packType)) {
    const response = await fetch(packType as string);
    const uiPack = (await response.json()) as IUIPackTheme;
    uiPackStore.set(uiPack);
    return mergeConfigurationWithUiPack(configuration, uiPack);
  }
  if (!packType) {
    return mergeConfigurationWithUiPack(configuration, packs.default);
  }
  if (!UIPackTypes.includes(packType as TUIPackType)) {
    return mergeConfigurationWithUiPack(configuration, packs.default);
  }

  return mergeConfigurationWithUiPack(configuration, packs[packType as TUIPackType]);
};

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
          callbacks,
        },
      },
    };
  });
};

/**
 * @description Merges the default translations with the translations provided by the user
 * @param translations translation overrides provided by the user
 */
export const mergeTranslationsOverrides = async (translations?: FlowsTranslations) => {
  if (!translations) return texts;
  texts = await mergeTranslations(texts, translations);
  return texts;
};

/**
 * @description Preload basic steps in the flow in case they exist
 * @param configuration merged general configuration
 */
export const preloadFlowBasicSteps = async (
  configuration: IAppConfiguration,
): Promise<IAppConfiguration> => {
  let flows: { [key: string]: IFlow } = {};
  for (const flowName of Object.keys(configuration.flows)) {
    const preloadedFlow = await preloadBasicSteps(configuration.flows[flowName]);
    flows = {
      ...flows,
      [flowName]: preloadedFlow,
    };
  }
  return {
    ...configuration,
    flows,
  };
};

/**
 * @description Preload basic steps in specific flow
 * @param flow
 */
const preloadBasicSteps = async (flow: IFlow): Promise<IFlow> => {
  const steps = flow.steps as IStepConfiguration[];
  let preloadedSteps = steps;
  // Welcome step preload
  const welcomeStep = steps.find(s => s.name === Steps.Welcome);
  if (welcomeStep) {
    const updatedWelcomeStep = await preloadStepImages(welcomeStep);
    preloadedSteps = preloadedSteps.map(s =>
      s.name === welcomeStep.name ? updatedWelcomeStep : s,
    );
  }
  // Loading step preload
  const loadingStep = steps.find(s => s.name === Steps.Loading);
  if (loadingStep) {
    const updatedLoadingStep = await preloadStepImages(loadingStep);
    preloadedSteps = preloadedSteps.map(s =>
      s.name === loadingStep.name ? updatedLoadingStep : s,
    );
  }
  return {
    ...flow,
    steps: preloadedSteps,
  };
};

/**
 * @description If {@link configuration.backendConfig.auth.method} is set to 'jwt' sets {@link configuration.backendConfig.auth.authorizationHeader} to \`Bearer ${jwt}\`
 * @param jwt - JWT token as string
 *
 * @see {@link configuration.backendConfig.auth}
 */
export const setAuthorizationHeaderJwt = (jwt: string) => {
  const { backendConfig } = get(configurationStore);
  const { method } = backendConfig?.auth ?? {};

  if (method !== 'jwt') {
    return;
  }

  return configurationStore.update(config => ({
    ...config,
    backendConfig: {
      ...config.backendConfig,
      auth: {
        ...config.backendConfig.auth,
        authorizationHeader: `Bearer ${jwt}`,
      },
    },
  }));
};
