import { Writable } from 'svelte/store';
import { IAppConfiguration, IStepConfiguration } from '../../contexts/configuration';
import { getFlowName } from '../../contexts/flows';
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

export const preloadStepImages = async (step: IStepConfiguration): Promise<IStepConfiguration> => {
  const elements = [];
  for (const element of step.elements) {
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
const preloadedSteps: Record<string, Record<string, boolean>> = {};

let isPreloadingInProgress = false;

export const preloadNextStepByCurrent = async (
  globalConfiguration: IAppConfiguration,
  configuration: Writable<IAppConfiguration>,
  currentStepId: string,
  skipType?: string,
) => {
  if (isPreloadingInProgress) {
    return setTimeout(() => {
      void preloadNextStepByCurrent(globalConfiguration, configuration, currentStepId, skipType);
    }, 100);
  }
  isPreloadingInProgress = true;
  const flowName: string = getFlowName();
  const nextStepId = getNextStepId(globalConfiguration, currentStepId, skipType);
  if (!nextStepId || (preloadedSteps[flowName] && preloadedSteps[flowName][nextStepId])) {
    isPreloadingInProgress = false;
    return;
  }
  const steps = globalConfiguration.flows[flowName].steps as IStepConfiguration[];
  const step = steps.find(s => s.id === nextStepId) as IStepConfiguration;
  const updatedStep = await preloadStepImages(step);
  const updatedSteps = steps.map(s => (s.id === nextStepId ? updatedStep : s));
  const updatedConfiguration: IAppConfiguration = {
    ...globalConfiguration,
    flows: {
      ...globalConfiguration.flows,
      [flowName]: {
        ...globalConfiguration.flows[flowName],
        steps: updatedSteps,
      },
    },
  };
  configuration.set(updatedConfiguration);
  if (!preloadedSteps[flowName]) preloadedSteps[flowName] = {};
  preloadedSteps[flowName][nextStepId] = true;
  isPreloadingInProgress = false;
};

export const preloadStepById = async (
  globalConfiguration: IAppConfiguration,
  configuration: Writable<IAppConfiguration>,
  stepId: string,
  flowName: string,
) => {
  const steps = globalConfiguration.flows[flowName].steps as IStepConfiguration[];
  const step = steps.find(s => s.id === stepId) as IStepConfiguration;
  const updatedStep = await preloadStepImages(step);
  const updatedSteps = steps.map(step => (step.id === updatedStep.id ? updatedStep : step));
  const updatedConfiguration: IAppConfiguration = {
    ...globalConfiguration,
    flows: {
      ...globalConfiguration.flows,
      [flowName]: {
        ...globalConfiguration.flows[flowName],
        steps: updatedSteps,
      },
    },
  };
  configuration.set(updatedConfiguration);
};
