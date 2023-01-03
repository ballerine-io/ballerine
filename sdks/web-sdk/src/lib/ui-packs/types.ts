import { FlowsGeneralTheme } from "../../types/BallerineSDK";
import { IConfigurationComponents, TSteps } from "../contexts/configuration";

export interface IUIPackTheme {
  general: FlowsGeneralTheme;
  components: IConfigurationComponents;
  steps: TSteps;
}

export enum EUIPackTypes {
  default = 'default',
  future = 'future'
}
export type TUIPacks = Record<EUIPackTypes, IUIPackTheme>;
