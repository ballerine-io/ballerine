import { get } from 'svelte/store';
import { vi } from 'vitest';
import { FlowsInitOptions } from '../../../types/BallerineSDK';
import {
  configuration,
  Elements,
  IAppConfiguration,
  IStepConfiguration,
  Steps,
} from '../../contexts/configuration';
import { TranslationType } from '../../contexts/translation';
import {
  mergeConfigOverrides,
  mergeTranslationsOverrides,
  populateConfigurationByUiPack,
  preloadFlowBasicSteps,
  setFlowCallbacks,
} from './configuration-manager';

const mockConfig: IAppConfiguration = {
  endUserInfo: { id: 'mock' },
  isDevelopment: true,
  backendConfig: {},
  defaultLanguage: 'en',
  flows: {},
};

const baseOverridesConfig: FlowsInitOptions = {
  endUserInfo: { id: 'test' },
};

describe('configuration-manager', () => {
  // mergeConfigOverrides
  it('mergeConfigOverrides should override endUserInfo.id', () => {
    configuration.set(mockConfig);
    const result = mergeConfigOverrides(baseOverridesConfig);
    expect(result).toEqual({ ...mockConfig, endUserInfo: { id: 'test' } });
  });
  it('mergeConfigOverrides should override primary color', () => {
    configuration.set(mockConfig);
    const result = mergeConfigOverrides({
      ...baseOverridesConfig,
      uiConfig: { general: { colors: { primary: 'red' } } },
    });
    expect(result.general?.colors?.primary).toEqual('red');
  });

  //populateConfigurationByUiPack
  it('mergeConfigOverrides should be populated with default ui pack', async () => {
    configuration.set(mockConfig);
    const result = await populateConfigurationByUiPack(mockConfig);
    expect(result.general?.colors?.primary).toEqual('#007AFF');
    expect(result.general?.fonts?.name).toEqual('Inter');
    expect(result.components?.title?.['font-size']).toEqual('18px');
  });

  it('mergeConfigOverrides should be populated with future ui pack', async () => {
    configuration.set(mockConfig);
    const result = await populateConfigurationByUiPack({ ...mockConfig, uiPack: 'future' });
    expect(result.general?.colors?.primary).toEqual('#F260FF');
    expect(result.general?.fonts?.name).toEqual('IBM Plex Mono');
    expect(result.components?.title?.['font-size']).toEqual('27px');
  });

  it('mergeConfigOverrides should be populated with future ui pack', async () => {
    configuration.set(mockConfig);
    const mockUiPack = { general: { colors: { primary: '#fff' } } };
    global.fetch = vi.fn(
      () =>
        Promise.resolve({
          json: () => Promise.resolve(mockUiPack),
        }) as Promise<Response>,
    );
    const result = await populateConfigurationByUiPack({
      ...mockConfig,
      uiPack: 'https://test.com.link',
    });
    expect(result.general?.colors?.primary).toEqual('#fff');
  });

  // setFlowCallbacks
  it('setFlowCallbacks should set callback for the specific flow', () => {
    configuration.set({ ...mockConfig, flows: { 'test-flow': {} } });
    const callback = () => null;
    setFlowCallbacks('test-flow', { onFlowComplete: callback });
    const result = get(configuration);
    expect(result.flows['test-flow'].callbacks?.onFlowComplete).toEqual(callback);
  });

  // mergeTranslationsOverrides
  it('mergeTranslationsOverrides should change translations for a specific language and key', async () => {
    configuration.set(mockConfig);
    const translationOverrides = { en: { welcome: { title: 'test' } } } as TranslationType;
    const result = await mergeTranslationsOverrides({ overrides: translationOverrides });
    expect(result.en.welcome.title).toEqual('test');
  });

  // mergeTranslationsOverrides
  it('mergeTranslationsOverrides should change translations for a specific language and key', async () => {
    configuration.set(mockConfig);
    global.fetch = vi.fn(
      () =>
        Promise.resolve({
          json: () => Promise.resolve({ en: { welcome: { title: 'remote' } } }),
        }) as Promise<Response>,
    );
    const result = await mergeTranslationsOverrides({ remoteUrl: 'https://test.com.link' });
    expect(result.en.welcome.title).toEqual('remote');
  });

  // preloadFlowBasicSteps
  it('preloadFlowBasicSteps should preload images', async () => {
    const configurationWithUiPack = await populateConfigurationByUiPack({
      ...mockConfig,
      flows: { 'test-flow': { steps: [{ id: Steps.Welcome, name: Steps.Welcome }] } },
    });
    global.fetch = vi.fn(
      () =>
        Promise.resolve({
          text: () => Promise.resolve('svg'),
        }) as Promise<Response>,
    );
    const result = await preloadFlowBasicSteps(configurationWithUiPack);
    const welcomeStep = result.flows['test-flow'].steps?.find(
      s => s.name === Steps.Welcome,
    ) as IStepConfiguration;
    const element = welcomeStep.elements.find(e => e.type === Elements.Image);
    expect(element?.props.attributes?.src).toEqual('svg');
  });
});
