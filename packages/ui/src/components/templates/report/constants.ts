import { ObjectValues } from '@ballerine/common';

export const AdsProvider = {
  FACEBOOK: 'facebook',
  INSTAGRAM: 'instagram',
} as const;

export const AdsProviders = [
  AdsProvider.FACEBOOK,
  AdsProvider.INSTAGRAM,
] as const satisfies ReadonlyArray<ObjectValues<typeof AdsProvider>>;

export const severityToDisplaySeverity = {
  positive: 'low',
  moderate: 'medium',
} as const;
