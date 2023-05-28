import { FlowsEventsConfig } from '../../../types/BallerineSDK';
import { IStepConfiguration } from '../configuration';

export interface IFlow {
  steps?: RecursivePartial<IStepConfiguration>[];
  userType?: string;
  mobileNativeCamera?: boolean;
  syncFlow?: boolean;
  useFinalQueryParams?: boolean;
  firstScreenBackButton?: boolean;
  showCloseButton?: boolean;
  callbacks?: FlowsEventsConfig;
}
