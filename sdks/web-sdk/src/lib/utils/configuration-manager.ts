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
  IStepConfiguration,
  Steps,
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

export let texts: TranslationType = translation;

export const updateConfiguration = async (configOverrides: RecursivePartial<FlowsInitOptions>) => {
  let configurationResult: IAppConfiguration | undefined = undefined;
  let uiTheme = packs.blue;

  configuration.update(currentConfig => {
    const mergedConfig = mergeConfig(currentConfig, configOverrides);
    configurationResult = mergedConfig;
    return mergedConfig;
  });

  const config = configurationResult as unknown as IAppConfiguration;
  config.steps[Steps.Welcome] = await preloadStepImages(config.steps[Steps.Welcome], uiTheme);
  configuration.update(() => config);

  const pack = configOverrides.uiConfig?.uiPack as string;
  if (isUrl(pack)) {
    const packConfigResponse = await fetch(pack);
    const packConfig = await packConfigResponse.json();
    uiPack.set(packConfig);
    return;
  }

  uiPack.update(currentPack => {
    // Check by existing ui pack names
    if (!Object.keys(packs).includes(pack)) return currentPack;
    const packName = pack as 'dark' | 'blue';
    const updatedPack = packs[packName];
    uiTheme = packs[packName];
    console.log("uiTheme", JSON.stringify(uiTheme));
    return updatedPack;
  });
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
) => {
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
  return newConfig;
};

const calcualteStepId = (step: RecursivePartial<IStepConfiguration>): string => {
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
          .map(e => calcualteStepId(e!))
          // Not using !!v | Boolean(v) to be more explicit.
          .filter((v): v is string => typeof v === 'string'); // check ts
      }
      const stepsConfig = toObjByKey(steps, calcualteStepId);
      flowSteps = {
        ...flowSteps,
        ...stepsConfig,
      };
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
