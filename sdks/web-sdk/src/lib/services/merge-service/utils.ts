import merge from 'deepmerge';
import { IStepConfiguration } from '../../contexts/configuration';

export const mergeStepConfig = (
  defaultConfig: IStepConfiguration,
  overrides: IStepConfiguration,
): IStepConfiguration => {
  const mergedConfig = merge(defaultConfig, overrides);
  console.log("mergedConfig", mergedConfig)
  return {
    ...mergedConfig,
    elements: overrides.elements || defaultConfig.elements,
    namespace: mergedConfig.namespace || mergedConfig.id || mergedConfig.name,
  };
};

export const isUrl = (url: string) => {
  const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(url);
}
