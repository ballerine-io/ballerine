import { ConfigSchema } from './zod-schemas';

describe('ConfigSchema', () => {
  it('accepts known KYC SDK config fields', () => {
    const result = ConfigSchema.safeParse({
      kycSdkSteps: ['welcome', 'document', 'selfie'],
      kycSdkDocumentOptions: [{ type: 'ID_CARD', kind: 'national_id', backSide: true }],
      kycSdkTheme: {
        primaryColor: '#0B63CE',
        fontFamily: 'Montserrat',
      },
      kycSdkUi: {
        enableLargeTypography: true,
        simplifyCopy: true,
        hideWebHeaderInNative: true,
        skipWelcomeWhenNativeIntro: true,
        showCompatTriggerReason: true,
        showHardFailDiagnostics: true,
        requireAddressProof: true,
        forceLegacyWhenAddressProof: true,
        enableLegacyFallbackOnInit: false,
      },
    });

    expect(result.success).toBe(true);
  });

  it('accepts unknown config keys for mixed-revision rollouts', () => {
    const result = ConfigSchema.safeParse({
      kycSdkSteps: ['welcome'],
      futureConfigField: { enabled: true },
    });

    expect(result.success).toBe(true);
  });

  it('still validates known key types', () => {
    const result = ConfigSchema.safeParse({
      kycSdkSteps: 'welcome',
      kycSdkUi: { requireAddressProof: 'true' },
    });

    expect(result.success).toBe(false);
  });
});
