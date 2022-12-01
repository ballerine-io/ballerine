import merge from 'deepmerge';
import { Writable } from 'svelte/store';
import { IAppConfiguration, IAppConfigurationUI, IStepConfiguration } from '../../contexts/configuration';
import { getNextStepId } from '../../contexts/navigation';

const preloadByExtension = async (src: string): Promise<string> => {
  if (src.includes('</svg>')) return src;
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

export const preloadStepImages = async (step: IStepConfiguration, uiPack: IAppConfigurationUI): Promise<IStepConfiguration> => {
  const defaultStepKey = Object.keys(uiPack.steps).find(
    s => s === step.name,
  ) as string;
  const defaultStep = uiPack.steps[defaultStepKey];
  const mergedStep = merge(defaultStep, step);
  // TODO: Think about merging elements
  mergedStep.elements = step.elements || defaultStep.elements;
  const elements = [];
  for (let index = 0; index < mergedStep.elements.length; index++) {
    const element = mergedStep.elements[index];
    if (element.props.attributes?.src) {
      const src = await preloadByExtension(element.props.attributes?.src);
      elements.push({
        ...element,
        props: {
          ...element.props,
          attributes: {
            ...element.props.attributes,
            src,
          },
        },
      });
    } else {
      elements.push(element);
    }
  }
  return {
    ...step,
    elements,
  };
};

// To prevent preload twice
const preloadedSteps: Record<string, boolean> = {};

export const preloadNextStepByCurrent = async (
  globalConfiguration: IAppConfiguration,
  configuration: Writable<IAppConfiguration>,
  currentStepId: string,
  uiPack: IAppConfigurationUI,
  skipType?: string,
) => {
  const nextStepId = getNextStepId(globalConfiguration, currentStepId, skipType);
  if (preloadedSteps[nextStepId]) return;
  const step = globalConfiguration.steps ? globalConfiguration.steps[nextStepId] : uiPack.steps[nextStepId];
  const updatedStep = await preloadStepImages(step, uiPack);
  const updatedConfiguration = {
    ...globalConfiguration,
    steps: {
      ...globalConfiguration.steps,
      [nextStepId]: updatedStep,
    },
  };
  configuration.set(updatedConfiguration);
  preloadedSteps[nextStepId] = true;
};

export const preloadStepById = async (
  globalConfiguration: IAppConfiguration,
  configuration: Writable<IAppConfiguration>,
  currentStepId: string,
  uiPack: IAppConfigurationUI,
) => {
  if (preloadedSteps[currentStepId]) return;
  const step = uiPack.steps[currentStepId];
  const updatedStep = await preloadStepImages(step, uiPack);
  const updatedConfiguration = {
    ...globalConfiguration,
    steps: {
      ...globalConfiguration.steps,
      [currentStepId]: updatedStep,
    },
  };
  configuration.set(updatedConfiguration);
  preloadedSteps[currentStepId] = true;
};
