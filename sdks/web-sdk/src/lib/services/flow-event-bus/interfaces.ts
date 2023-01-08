import { IDocumentVerificationResponse } from '../../utils/event-service';
import { FlowEvent, TFlowEvent } from './enums';
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

export interface IFlowEventBusParams<
  TType extends TFlowEvent,
  TPayload extends TFlowEventBusPayload,
> {
  type: TType;
  payload: TPayload;
}

// Overloading is required in order for the payload's type to be inferred correctly within flowEventBus's switch/case clause.
export interface IFlowEventBus {
  ({
    type,
    payload,
  }: IFlowEventBusParams<typeof FlowEvent.FLOW_COMPLETE, IFlowCompletePayload>): void;

  ({ type, payload }: IFlowEventBusParams<typeof FlowEvent.FLOW_EXIT, IFlowExitPayload>): void;

  ({ type, payload }: IFlowEventBusParams<typeof FlowEvent.FLOW_ERROR, IFlowErrorPayload>): void;

  ({
    type,
    payload,
  }: IFlowEventBusParams<
    typeof FlowEvent.FLOW_NAVIGATION_UPDATE,
    IFlowNavigationUpdatePayload
  >): void;
}
