import { TObjectValues } from '@/common/types';

export const AdsProvider = {
  FACEBOOK: 'FACEBOOK',
  INSTAGRAM: 'INSTAGRAM',
} as const;

export const AdsProviders = [
  AdsProvider.FACEBOOK,
  AdsProvider.INSTAGRAM,
] as const satisfies ReadonlyArray<TObjectValues<typeof AdsProvider>>;
