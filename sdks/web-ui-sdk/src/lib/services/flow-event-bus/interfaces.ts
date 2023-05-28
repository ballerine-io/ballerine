import { IDocumentVerificationResponse } from '../../utils/event-service';
import { FlowEventType } from './enums';
import { AnyRecord } from '../../../types';
import { TFlowEventBusPayload } from './types';
import { TEventTypes } from '../../utils/event-service/types';

export interface IEventOptions {
  eventName: string;
  eventType: TEventTypes;
}

export interface IFlowCompletePayload extends IEventOptions {
  payload: IDocumentVerificationResponse;
}

export interface IFlowExitPayload extends IEventOptions {
  payload: AnyRecord;
}

export interface IFlowErrorPayload extends IEventOptions {
  payload: AnyRecord;
}

export interface IFlowNavigationUpdatePayload extends IEventOptions {
  details: {
    currentIdx: number;
    currentPage: string;
    previousPage: string;
  };
}

type IFlowEventBusParams<TType extends FlowEventType, TPayload extends TFlowEventBusPayload> = {
  type: TType;
  payload: TPayload;
};

type FlowEvent =
  | IFlowEventBusParams<'FLOW_COMPLETE', IFlowCompletePayload>
  | IFlowEventBusParams<'FLOW_EXIT', IFlowExitPayload>
  | IFlowEventBusParams<'FLOW_ERROR', IFlowErrorPayload>
  | IFlowEventBusParams<'FLOW_NAVIGATION_UPDATE', IFlowNavigationUpdatePayload>;

export type FlowEventBusFn = <T extends FlowEvent>(flowEvent: T) => void;
