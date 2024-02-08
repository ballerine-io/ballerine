import { configuration } from './lib/contexts/configuration';
import { resetAppState } from './lib/contexts/app-state/utils';
import ConfigurationProvider from './ConfigurationProvider.svelte';
import type { BallerineSDKFlows, FlowsInitOptions } from './types/BallerineSDK';
import { getConfigFromQueryParams } from './lib/utils/get-config-from-query-params';
import { configuration as defaultConfiguration } from './lib/configuration/configuration';
import {
  setAuthorizationHeaderJwt,
  setFlowCallbacks,
  appInit,
  mergeTranslationsOverrides,
} from './lib/services/configuration-manager';

export const flows: BallerineSDKFlows = {
  init: config => {
    return new Promise((resolve, reject) => {
      console.log(
        'BallerineSDK: Initializing BallerineSDK with version: ',
        __APP_VERSION__,
        config,
      );

      // Always init with no state. This ensures using init to reset the flow returns to the first step with no data.
      void resetAppState();

      configuration.set(defaultConfiguration);

      const { translations: _translations, ...configWithoutTranslations } = config;

      // Extract config from query params
      const { clientId, flowName, ...endUserInfoFromQueryParams } = getConfigFromQueryParams();

      // Merge the two config objects
      const mergedConfig: FlowsInitOptions = {
        ...configWithoutTranslations,
        endUserInfo: {
          ...configWithoutTranslations.endUserInfo,
          ...endUserInfoFromQueryParams,
        },
      };

      const configPromise = appInit(mergedConfig);
      const translationsPromise = mergeTranslationsOverrides(_translations);

      Promise.all([configPromise, translationsPromise])
        .then(() => resolve())
        .catch(reject);
    });
  },

  mount({
    flowName = getConfigFromQueryParams().flowName,
    callbacks,
    jwt,
    useModal = false,
    elementId = '',
  }) {
    const hostElement = useModal
      ? document.querySelector('body')
      : document.getElementById(elementId);

    if (hostElement) {
      hostElement.innerHTML = `
        <div class="loader-container" id="blrn-loader">
            <div class="loader"></div>
        </div>
      `;
    } else {
      const message = useModal ? 'body' : `with id ${elementId}`;

      console.error(`BallerineSDK: Could not find element ${message}`);
    }

    // Merge the passed in callbacks into the Svelte configuration store of the specified flow.
    // Calling setFlowCallbacks below ConfigurationProvider results in stale state for instances of get(configuration).
    setFlowCallbacks(flowName, callbacks);

    if (jwt) {
      setAuthorizationHeaderJwt(jwt);
    }

    new ConfigurationProvider({
      target: hostElement as HTMLElement,
      props: {
        flowName,
        useModal,
      },
    });
  },
  setConfig: function (_config: FlowsInitOptions): Promise<void> {
    throw new Error('Function not implemented.');
  },
};
