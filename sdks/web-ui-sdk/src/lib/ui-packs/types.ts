import { FlowsGeneralTheme } from '../../types/BallerineSDK';
import { IConfigurationComponents, TStepsConfigurations } from '../contexts/configuration';
import { ObjectValues } from '../contexts/app-state/types';

export interface IUIPackTheme {
  general: FlowsGeneralTheme;
  components: IConfigurationComponents;
  steps: TStepsConfigurations;
}

export const UIPackType = {
  default: 'default',
  future: 'future',
} as const;

export const UIPackTypes = [UIPackType.default, UIPackType.future];

export type TUIPackType = ObjectValues<typeof UIPackType>;

export type TUIPacks = Record<TUIPackType, IUIPackTheme>;
