import ConfigurationProvider from './ConfigurationProvider.svelte';
import type { BallerineSDKFlows, FlowsInitOptions } from './types/BallerineSDK';
import { getConfigFromQueryParams } from './lib/utils/get-config-from-query-params';
import { configuration } from './lib/contexts/configuration';
import { configuration as defaultConfiguration } from './lib/configuration/configuration';
import { resetAppState } from './lib/contexts/app-state/utils';
import { appInit, setFlowCallbacks, mergeTranslationsOverrides } from './lib/services/configuration-manager';
//
export const flows: BallerineSDKFlows = {
  // Use the b_fid query param as the default flowName, fallback to the passed flowName arg.
  // Optional args/args with default values should probably be last.
  // Async due to setFlowCallbacks using updateConfiguration, which is async.
  mount(flowName = getConfigFromQueryParams().flowName, elementId, config) {
    const hostElement = document.getElementById(elementId);
    if (hostElement) {
      hostElement.innerHTML = `<div class="loader-container" id="blrn-loader">
      <div class="loader"></div>
    </div>
    `;
    } else {
      console.error('BallerineSDK: Could not find element with id', elementId);
    }

    // Merge the passed in callbacks into the Svelte configuration store of the specified flow.
    // Calling setFlowCallbacks below ConfigurationProvider results in stale state for instances of get(configuration).
    setFlowCallbacks(flowName, config.callbacks);

    new ConfigurationProvider({
      target: document.getElementById(elementId) as HTMLElement,
      props: {
        flowName,
      },
    });
  },
  openModal(flowName, config) {
    const hostElement = document.querySelector('body');
    if (hostElement) {
      hostElement.innerHTML = `<div class="loader-container" id="blrn-loader">
      <div class="loader"></div>
    </div>
    `;
    } else {
      console.error('BallerineSDK: Could not find element body');
    }

    // Merge the passed in callbacks into the Svelte configuration store of the specified flow.
    // Calling setFlowCallbacks below ConfigurationProvider results in stale state for instances of get(configuration).
    setFlowCallbacks(flowName, config.callbacks);

    new ConfigurationProvider({
      target: hostElement as HTMLElement,
      props: {
        flowName,
        useModal: true,
      },
    });
  },
  init: config => {
    return new Promise((resolve, reject) => {
      console.log(
        'BallerineSDK: Initializing BallerineSDK with version: ',
        __APP_VERSION__,
        config,
      );

      // Always init with no state. This ensures using init to reset the flow returns to the first step with no data.
      void resetAppState();
      // Always init with no configuration. This handles multiple calls to init, i.e React re-renders.
      // Otherwise, the steps array could keep growing.
      configuration.set(defaultConfiguration);

      const { translations, ...restConfig } = config;
      // Extract config from query params
      const {
        clientId: _clientId,
        flowName: _flowName,
        ...endUserInfo
      } = getConfigFromQueryParams();
      // Merge the two config objects
      const mergedConfig: FlowsInitOptions = {
        ...restConfig,
        endUserInfo: {
          ...restConfig.endUserInfo,
          ...endUserInfo,
        },
      };
      const configPromise = appInit(mergedConfig);
      const translationsPromise = mergeTranslationsOverrides(config.translations);
      Promise.all([configPromise, translationsPromise])
        .then(() => resolve())
        .catch(reject);
    });
  },
  setConfig: function (config: FlowsInitOptions): Promise<void> {
    throw new Error('Function not implemented.');
  },
};
