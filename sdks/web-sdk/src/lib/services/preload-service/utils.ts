import merge from 'deepmerge';
import { Writable } from 'svelte/store';
import { IAppConfiguration, IStepConfiguration } from '../../contexts/configuration';
import { getNextStepId } from '../../contexts/navigation';
import { defaultStepsConfigurations } from './constants';

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

export const preloadStepImages = async (step: IStepConfiguration): Promise<IStepConfiguration> => {
  const defaultStep = defaultStepsConfigurations.find(
    s => s.name === step.name,
  ) as IStepConfiguration;
  const mergedStep = merge(defaultStep, step);
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
  skipType?: string,
) => {
  const nextStepId = getNextStepId(globalConfiguration, currentStepId, skipType);
  if (preloadedSteps[nextStepId]) return;
  const step = globalConfiguration.steps[nextStepId];
  const updatedStep = await preloadStepImages(step);
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
) => {
  if (preloadedSteps[currentStepId]) return;
  const step = globalConfiguration.steps[currentStepId];
  const updatedStep = await preloadStepImages(step);
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
