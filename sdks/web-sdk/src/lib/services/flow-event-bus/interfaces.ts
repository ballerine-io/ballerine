import { IDocumentVerificationResponse } from '../../utils/event-service/types';
import { EFlowEvent } from './enums';
import { TFlowEventBusPayload } from './types';

export interface IEventOptions {
  eventName: string;
  eventType: string;
}

export interface IFlowCompletePayload extends IEventOptions {
  payload: IDocumentVerificationResponse;
}

export interface IFlowExitPayload extends IEventOptions {
  payload: Record<PropertyKey, any>;
}

export interface IFlowErrorPayload extends IEventOptions {
  payload: Record<PropertyKey, any>;
}

export interface IFlowNavigationUpdatePayload extends IEventOptions {
  details: {
    currentIdx: number;
    currentPage: string;
    previousPage: string;
  };
}

export interface IFlowEventBusParams<TType extends EFlowEvent, TPayload extends TFlowEventBusPayload> {
  type: TType;
  payload: TPayload;
}

// Overloading is required in order for the payload's type to be inferred correctly within flowEventBus's switch/case clause.
export interface IFlowEventBus {
  ({ type, payload }: IFlowEventBusParams<EFlowEvent.FLOW_COMPLETE, IFlowCompletePayload>): void;

  ({ type, payload }: IFlowEventBusParams<EFlowEvent.FLOW_EXIT, IFlowExitPayload>): void;

  ({ type, payload }: IFlowEventBusParams<EFlowEvent.FLOW_ERROR, IFlowErrorPayload>): void;

  ({ type, payload }: IFlowEventBusParams<EFlowEvent.FLOW_NAVIGATION_UPDATE, IFlowNavigationUpdatePayload>): void;

}
