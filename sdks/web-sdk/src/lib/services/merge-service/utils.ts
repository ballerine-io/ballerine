import merge from 'deepmerge';
import { IStepConfiguration } from '../../contexts/configuration';

export const mergeStepConfig = (
  defaultConfig: IStepConfiguration,
  overrides: IStepConfiguration,
): IStepConfiguration => {
  const mergedConfig = merge(defaultConfig, overrides);
  return {
    ...mergedConfig,
    elements: overrides.elements || defaultConfig.elements,
    namespace: mergedConfig.namespace || mergedConfig.id || mergedConfig.name,
  };
};
