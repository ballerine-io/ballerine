import { ITheme } from '@/common/types/settings';

export interface ISignupLayoutContext {
  themeParams?: NonNullable<ITheme['signup']>;
}
