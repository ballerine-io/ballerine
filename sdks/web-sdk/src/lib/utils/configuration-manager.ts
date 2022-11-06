import mergeObj from 'lodash.merge';
import toObjByKey from 'lodash.keyby';
import translation from '../default-configuration/translation.json';
import { TranslationType } from '../contexts/translation';
import {
  configuration,
  Elements,
  IAppConfiguration,
  IStepConfiguration,
  Steps,
} from '../contexts/configuration';
import { FlowsEventsConfig, FlowsInitOptions, FlowsTranslations } from '../../types/BallerineSDK';
import { IFlow } from '../contexts/flows';
import { IDocumentOptionItem } from '../organisms/DocumentOptions/types';
import { AnyRecord } from '../../types';

export let texts: TranslationType = translation;

const preloadByExtension = async (src: string): Promise<string> => {
  const extension = src.split('.').pop();
  let svg: string | undefined;

  if (extension === 'svg') {
    const response = await fetch(src);

    svg = await response.text();
  }

  return new Promise((resolve, reject) => {
    if (svg) return resolve(svg);

    const img = new Image();
    img.onload = () => resolve(img.src);
    img.onerror = reject;
    img.src = src;
  });
};

const updateSteps = async (steps: {
  [key: string]: IStepConfiguration;
}): Promise<{ [key: string]: IStepConfiguration }> => {
  const updatedSteps: { [key: string]: IStepConfiguration } = { ...steps };
  const stepsKeys = Object.keys(steps);
  for (let i = 0; i < stepsKeys.length; i++) {
    const step = steps[stepsKeys[i]];
    step.namespace = step.namespace || step.id || step.name;
    if (step.elements) {
      for (let j = 0; j < step.elements.length; j++) {
        const element = step.elements[j];
        if (element.type === Elements.Image && element.props.attributes?.src) {
          const { src } = element.props.attributes;
          updatedSteps[stepsKeys[i]].elements[j].props.attributes!.src = await preloadByExtension(
            src,
          );
        }
      }
    }
  }
  return updatedSteps;
};

const preloadImages = async (configuration: IAppConfiguration): Promise<IAppConfiguration> => {
  return {
    ...configuration,
    steps: await updateSteps(configuration.steps),
  };
};

export const updateConfiguration = async (configOverrides: RecursivePartial<FlowsInitOptions>) => {
  let configurationResult: IAppConfiguration | undefined = undefined;

  configuration.update(currentConfig => {
    const mergedConfig = mergeConfig(currentConfig, configOverrides);
    configurationResult = mergedConfig;
    return mergedConfig;
  });
  const config = configurationResult as unknown as IAppConfiguration;
  const updatedConfig = await preloadImages(config);

  configuration.update(() => updatedConfig);
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
