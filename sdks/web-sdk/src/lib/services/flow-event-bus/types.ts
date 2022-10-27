import {
  IFlowCompletePayload,
  IFlowErrorPayload,
  IFlowExitPayload,
  IFlowNavigationUpdatePayload,
} from './interfaces';

export type TFlowEventBusPayload =
  | IFlowCompletePayload
  | IFlowExitPayload
  | IFlowErrorPayload
  | IFlowNavigationUpdatePayload;
