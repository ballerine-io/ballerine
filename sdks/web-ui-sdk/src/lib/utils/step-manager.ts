import { IStepConfiguration } from '../contexts/configuration';

export const getTranslationNamespace = (step: IStepConfiguration) =>
  step.namespace || step.id !== step.name ? step.id : undefined;
