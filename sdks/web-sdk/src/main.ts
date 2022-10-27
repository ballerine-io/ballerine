import ConfigurationProvider from './ConfigurationProvider.svelte';
import { BallerineSDK } from './types/BallerineSDK';
import {
  setFlowCallbacks,
  updateConfiguration,
  updateTranslations,
} from './lib/utils/configuration-management';
import { BallerineSDKFlows } from './types/BallerineSDK';
import { getConfigFromQueryParams } from './lib/utils/get-config-from-query-params';
//
export const flows: BallerineSDKFlows = {
  // Use the b_fid query param as the default flowName, fallback to the passed flowName arg.
  // Optional args/args with default values should probably be last.
  // Async due to setFlowCallbacks using updateConfiguration, which is async.
  async mount(elementId, flowName = getConfigFromQueryParams().flowName, config) {
    const hostElement = document.getElementById(elementId);
    if (hostElement) {
      hostElement.innerHTML = `<div class='loader-container' id='blrn-loader'>
      <div class='loader'></div>
    </div>
    `;
    } else {
      console.error('BallerineSDK: Could not find element with id', elementId);
    }

    new ConfigurationProvider({
      target: document.getElementById(elementId) as HTMLElement,
      props: {
        flowName,
      },
    });

    // Merge the passed in callbacks into the Svelte configuration store of the specified flow.
    if (!config.callbacks) return;

    await setFlowCallbacks(flowName, config.callbacks);
  },
  openModal(flowName, config) {
    const hostElement = document.querySelector('body');
    if (hostElement) {
      hostElement.innerHTML = `<div class='loader-container' id='blrn-loader'>
      <div class='loader'></div>
    </div>
    `;
    } else {
      console.error('BallerineSDK: Could not find element body');
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
  set: function (key: string, value: any): void {
    throw new Error('Function not implemented.');
  },
};
