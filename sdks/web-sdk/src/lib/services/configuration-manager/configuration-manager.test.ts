import { FlowsInitOptions } from '../../../types/BallerineSDK';
import { configuration, IAppConfiguration, IAppConfigurationUI } from '../../contexts/configuration';
import { mergeConfigOverrides, populateConfigurationByUiPack } from './configuration-manager';

const mockConfig: IAppConfiguration = {
  endUserInfo: { id: "mock" },
  isDevelopment: true,
  backendConfig: {},
  defaultLanguage: "en",
  flows: {}
}

const baseOverridesConfig: FlowsInitOptions = {
  endUserInfo: { id: "test" }
}

describe('configuration-manager', () => {
  // mergeConfigOverrides
  it('mergeConfigOverrides should override endUserInfo.id', () => {
    configuration.set(mockConfig);
    const result = mergeConfigOverrides(baseOverridesConfig);
    expect(result).toEqual({ ...mockConfig, endUserInfo: { id: "test" } });
  });
  it('mergeConfigOverrides should override primary color', () => {
    configuration.set(mockConfig);
    const result = mergeConfigOverrides({ ...baseOverridesConfig, uiConfig: { general: { colors: { primary: "red" } } } });
    expect(result.general?.colors?.primary).toEqual("red");
  });

  //populateConfigurationByUiPack
  it('mergeConfigOverrides should be populated with default ui pack', async () => {
    configuration.set(mockConfig);
    const result = await populateConfigurationByUiPack(mockConfig);
    expect(result.general?.colors?.primary).toEqual("#007AFF");
    expect(result.general?.fonts?.name).toEqual("Inter");
    expect(result.components?.title?.['font-size']).toEqual("18px");
  });
  it('mergeConfigOverrides should be populated with future ui pack', async () => {
    configuration.set(mockConfig);
    const result = await populateConfigurationByUiPack({ ...mockConfig, uiPack: "future" });
    expect(result.general?.colors?.primary).toEqual("#F260FF");
    expect(result.general?.fonts?.name).toEqual("IBM Plex Mono");
    expect(result.components?.title?.['font-size']).toEqual("27px");
  });
});
