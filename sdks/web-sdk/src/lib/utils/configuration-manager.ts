import mergeObj from 'lodash.merge';
import toObjByKey from 'lodash.keyby';
import translation from '../default-configuration/translation.json';
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

export let texts: TranslationType = translation;

export const updateConfiguration = async (configOverrides: RecursivePartial<FlowsInitOptions>) => {
  let configurationResult: IAppConfiguration | undefined = undefined;

  configuration.update(currentConfig => {
    const mergedConfig = mergeConfig(currentConfig, configOverrides);
    configurationResult = mergedConfig;
    return mergedConfig;
  });
  const config = configurationResult as unknown as IAppConfiguration;

  config.steps[Steps.Welcome] = await preloadStepImages(config.steps[Steps.Welcome]);

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
) => {
  const newConfig: IAppConfiguration = mergeObj(originalConfig, v1adapter(overrides));
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

const calcualteStepId = (step: RecursivePartial<IStepConfiguration>) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (!step.id || step.id === step.name) return `${step.name!}${step.type ? '-' + step.type : ''}`;
  return step.id;
};

const v1adapter = (
  config: RecursivePartial<FlowsInitOptions>,
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
    general,
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
