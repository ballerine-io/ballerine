import { TFormEventElement, TElementEvent } from '../../hooks/internal/useEvents/types';

export interface IEventsListener {
  id: string;
  eventName: TElementEvent;
  callback: (eventName: TElementEvent, element: TFormEventElement) => void;
}

export interface IEventsProviderContext {
  subscribe: (listener: IEventsListener) => void;
  unsubscribe: (listener: IEventsListener) => void;
  run: (eventName: TElementEvent, element: TFormEventElement) => void;
  event: (eventName: TElementEvent, element: TFormEventElement) => void;
  listeners: IEventsListener[];
}
