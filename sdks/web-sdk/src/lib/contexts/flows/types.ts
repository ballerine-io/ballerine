import { FlowsEventsConfig } from '../../../types/BallerineSDK';

export interface IFlow {
  name?: string;
  stepsOrder?: string[];
  userType?: string;
  nativeCamera?: boolean;
  syncFlow?: boolean;
  useFinalQueryParams?: boolean;
  callbacks?: FlowsEventsConfig;
  firstScreenBackButton?: boolean;
  showCloseButton?: boolean;
}
