import { mergeConfigurationWithUiPack } from './utils';
import { packs } from '../../ui-packs';

const baseConfiguration = {
  isDevelopment: true,
  backendConfig: {},
  defaultLanguage: 'en',
  endUserInfo: { id: 'mock-end-user' },
  flows: {
    kyc: {
      steps: [{ id: 'address-proof-check', name: 'address-proof-check' }],
    },
  },
  metricsConfig: {},
};

describe('mergeService utils', () => {
  it('normalizes legacy kyc step id before merge', () => {
    const result = mergeConfigurationWithUiPack(baseConfiguration as any, packs.default);

    expect(result.flows.kyc.steps?.[0]?.id).toEqual('check-address-proof');
  });

  it('throws when step id cannot be mapped to a UI pack step', () => {
    expect(() => {
      mergeConfigurationWithUiPack(
        {
          ...baseConfiguration,
          flows: {
            kyc: {
              steps: [{ id: 'non-existent-step', name: 'non-existent-step' }],
            },
          },
        } as any,
        packs.default,
      );
    }).toThrowError('Invalid step id provided: non-existent-step');
  });
});

