/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import mergeObj from 'deepmerge';
import translation from '../configuration/translation.json';
import { TranslationType } from '../contexts/translation';
import {
  configuration,
  IAppConfiguration,
  IAppConfigurationUI,
  IElement,
  IStepConfiguration,
  Steps,
  TSteps,
} from '../contexts/configuration';
import { FlowsEventsConfig, FlowsInitOptions, FlowsTranslations } from '../../types/BallerineSDK';
import { IFlow } from '../contexts/flows';
import { IDocumentOptionItem } from '../organisms/DocumentOptions/types';
import { AnyRecord } from '../../types';
import { preloadStepImages } from '../services/preload-service/utils';
import { packs, uiPack } from '../ui-packs';
import { isUrl } from '../services/merge-service';

const keyBy = (array: any[], key: string | Function): any =>
  (array || []).reduce((r, x) => {
    const calcluatedKey = typeof key === 'function' ? key(x) : key;
    return { ...r, [calcluatedKey]: x };
  }, {});

const toObjByKey = (collection: any, key: string | Function) => {
  const c = collection || {};
  return Array.isArray(c) ? keyBy(c, key) : keyBy(Object.values(c), key);
};

const setElementsFromOverrides = (
  steps: Record<string, IStepConfiguration>,
  overrides: Record<string, IStepConfiguration>,
) => {
  const updatedSteps: Record<string, IStepConfiguration> = {};
  Object.keys(steps).forEach(stepKey => {
    const flowStep = overrides[stepKey];
    if (!flowStep || !flowStep.elements || flowStep.elements.length === 0) {
      updatedSteps[stepKey] = steps[stepKey];
      return;
    }
    updatedSteps[stepKey] = {
      ...steps[stepKey],
      elements: flowStep.elements
    };
  });
  return {
    ...overrides,
    ...updatedSteps
  };
}

const mergeStepElements = (config: IAppConfiguration, uiTheme: IAppConfigurationUI) => {
  const updatedConfig = config;
  if (!updatedConfig.steps) return config;
  // Merge elements with uiPack
  Object.keys(updatedConfig.steps).forEach(stepKey => {
    const steps = updatedConfig.steps as TSteps;
    const step = steps[stepKey];
    if (!step.elements || step.elements.length === 0) {
      return;
    }
    const elements: IElement[] = [];
    uiTheme.steps[stepKey].elements.forEach(element => {
      const stepElement = step.elements.find(e => e.id === element.id);
      // element configuration not provided - using ui pack element
      if (!stepElement) {
        elements.push(element);
        return;
      }
      // element configuration provided to remove element
      if (stepElement.disabled) {
        return
      }
      // element configuration provided to edit element
      elements.push(mergeObj(element, stepElement))
    })
    // elements configuration provided to add element
    const newElements = step.elements.filter(stepElement => {
      const uiPackElements = uiTheme.steps[stepKey].elements;
      return !uiPackElements.find(packElement => packElement.id === stepElement.id);
    });
    updatedConfig.steps[stepKey].elements = [...elements, ...newElements].sort((e1, e2) => (e1.orderIndex - e2.orderIndex));
  });
  return updatedConfig;
}

export let texts: TranslationType = translation;

export const updateConfiguration = async (configOverrides: RecursivePartial<FlowsInitOptions>) => {
  let configurationResult: IAppConfiguration | undefined = undefined;
  let uiTheme = packs.default;
  configuration.update(currentConfig => {
    const mergedConfig = mergeConfig(currentConfig, configOverrides, uiTheme);
    configurationResult = mergedConfig;
    return mergedConfig;
  });

  const config = (configurationResult as unknown as IAppConfiguration);

  const pack = configOverrides.uiConfig?.uiPack as string;

  if (isUrl(pack)) {
    const packConfigResponse = await fetch(pack);
    const packConfig = await packConfigResponse.json();
    uiPack.set(packConfig);
  } else {
    uiPack.update(currentPack => {
      // Check by existing ui pack names
      if (!Object.keys(packs).includes(pack)) return currentPack;
      const packName = pack as 'default' | 'future';
      const updatedPack = packs[packName];
      uiTheme = packs[packName];
      return updatedPack;
    });
  }

  uiPack.update(currentPack => {
    // Check by existing ui pack names
    if (!Object.keys(packs).includes(pack)) return currentPack;
    const packName = pack as 'default' | 'future';
    const updatedPack = packs[packName];
    uiTheme = packs[packName];
    return updatedPack;
  });

  config.steps[Steps.Welcome] = await preloadStepImages(config.steps[Steps.Welcome], uiTheme);
  config.steps[Steps.Loading] = await preloadStepImages(config.steps[Steps.Loading], uiTheme);
  config.steps[Steps.Final] = await preloadStepImages(config.steps[Steps.Final], uiTheme);
  configuration.update(() => config);
};

export const updateTranslations = async (translations: FlowsTranslations) => {
  if (translations.overrides) {
    texts = mergeObj(texts, translations.overrides);
  }
  if (translations.remoteUrl) {
    try {
      const response = await fetch(translations.remoteUrl);
      const overrides = (await response.json()) as TranslationType;
      texts = mergeObj(texts, overrides);
    } catch (error) {
      console.error(error);
    }
  }
};

export const mergeConfig = (
  originalConfig: IAppConfiguration,
  overrides: RecursivePartial<FlowsInitOptions>,
  uiTheme: IAppConfigurationUI,
) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const newConfig: IAppConfiguration = mergeObj(
    originalConfig,
    v1adapter(overrides, originalConfig),
  );
  if (
    newConfig.steps &&
    newConfig.steps[Steps.DocumentSelection] &&
    newConfig.steps[Steps.DocumentSelection].documentOptions &&
    newConfig.documentOptions
  ) {
    const documentOptions = newConfig.steps[Steps.DocumentSelection].documentOptions?.reduce(
      (docOpts, docType) => {
        docOpts[docType] = newConfig.documentOptions?.options[docType];
        return docOpts;
      },
      {} as IDocumentOptionItem,
    );

    if (!documentOptions) return newConfig;

    newConfig.documentOptions.options = documentOptions;
  }

  const updatedConfig = mergeStepElements(newConfig, uiTheme);

  return updatedConfig;
};

const calculateStepId = (step: RecursivePartial<IStepConfiguration>): string => {
  if (!step.id || step.id === step.name) return `${step.name!}${step.type ? '-' + step.type : ''}`;
  return step.id;
};

const v1adapter = (
  config: RecursivePartial<FlowsInitOptions>,
  originalConfig: IAppConfiguration,
):
  | IAppConfiguration
  // We should either infer the return type or correct it. endUserInfo is not supposed to be a partial and general not undefined.
  | AnyRecord => {
  const { uiConfig = {}, endUserInfo = {}, backendConfig = {} } = config;
  const { flows = {}, general, components } = uiConfig;
  const newFlows = {} as { [key: string]: IFlow };
  let flowSteps = {};
  for (const [flowName, flow] of Object.entries(flows)) {
    if (flow) {
      const { steps, ...flowConfig } = flow;
      newFlows[flowName] = {
        name: flowName,
        ...flowConfig,
      };
      if (steps) {
        newFlows[flowName].stepsOrder = steps
          .map(e => calculateStepId(e!))
          // Not using !!v | Boolean(v) to be more explicit.
          .filter((v): v is string => typeof v === 'string'); // check ts
      }
      const stepsConfig = toObjByKey(steps, calculateStepId);
      flowSteps = setElementsFromOverrides(stepsConfig, flowSteps);
    }
  }
  return {
    endUserInfo,
    backendConfig,
    flows: newFlows,
    steps: flowSteps,
    general: general || originalConfig.general,
    ...components,
  };
};

/**
 * @description Updates the configuration Svelte store callbacks object of a given flow by name.
 * @param flowName
 * @param callbacks
 */
export const setFlowCallbacks = async (flowName: string, callbacks: FlowsEventsConfig) => {
  return updateConfiguration({
    uiConfig: {
      flows: {
        [flowName]: {
          callbacks,
        },
      },
    },
  });
};
