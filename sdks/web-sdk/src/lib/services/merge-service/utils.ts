import deepmerge from 'deepmerge';
import merge from 'deepmerge';
import { FlowsTranslations } from '../../../types/BallerineSDK';
import { IStepConfiguration } from '../../contexts/configuration';
import { TranslationType } from '../../contexts/translation';

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

export const isUrl = (url: string) => {
  const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(url);
}

/**
 * @description Merges the default translations with the
 * @param original default app translations
 * @param overridesTranslationConfiguration translation configuration provided by the user
 */
export const mergeTranslations = async (original: TranslationType, overridesTranslationConfiguration: FlowsTranslations): Promise<TranslationType> => {
  // When overrides provided by the user in the configuration
  if (overridesTranslationConfiguration.overrides) {
    return deepmerge(original, overridesTranslationConfiguration.overrides);
  }
  // When remote url provided by the user
  if (overridesTranslationConfiguration.remoteUrl) {
    try {
      const response = await fetch(overridesTranslationConfiguration.remoteUrl);
      const overrides = (await response.json()) as TranslationType;
      return deepmerge(original, overrides);
    } catch (error) {
      console.error(error);
    }
  }
  return original;
};
