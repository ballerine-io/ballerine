import ConfigurationProvider from './ConfigurationProvider.svelte';
import type { BallerineSDKFlows, FlowsInitOptions } from './types/BallerineSDK';
import {
  setFlowCallbacks,
  updateConfiguration,
  updateTranslations,
} from './lib/utils/configuration-manager';
import { getConfigFromQueryParams } from './lib/utils/get-config-from-query-params';
//
export const flows: BallerineSDKFlows = {
  // Use the b_fid query param as the default flowName, fallback to the passed flowName arg.
  // Optional args/args with default values should probably be last.
  // Async due to setFlowCallbacks using updateConfiguration, which is async.
  async mount(flowName = getConfigFromQueryParams().flowName, elementId, config) {
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
    if (config.callbacks) {
      await setFlowCallbacks(flowName, config.callbacks);
    }

    new ConfigurationProvider({
      target: document.getElementById(elementId) as HTMLElement,
      props: {
        flowName,
      },
    });
  },
  async openModal(flowName, config) {
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
    if (config.callbacks) {
      await setFlowCallbacks(flowName, config.callbacks);
    }

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
      const { translations, ...restConfig } = config;
      // Extract config from query params
      const {
        clientId: _clientId,
        flowName: _flowName,
        ...endUserInfo
      } = getConfigFromQueryParams();
      // Merge the two config objects
      const mergedConfig = {
        ...restConfig,
        endUserInfo: {
          ...restConfig.endUserInfo,
          ...endUserInfo,
        },
      };
      const configPromise = updateConfiguration(mergedConfig);
      const translationsPromise = config.translations
        ? updateTranslations(config.translations)
        : undefined;
      Promise.all([configPromise, translationsPromise])
        .then(() => resolve())
        .catch(reject);
    });
  },
  setConfig: function (config: FlowsInitOptions): Promise<void> {
    throw new Error('Function not implemented.');
  },
};
