import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { ExtractWorkflowEventData, TEventName } from '@/workflow/types';

export type EventConfig = {
  forceEmit?: boolean;
};

const DEFAULT_CONFIG = { forceEmit: false };
@Injectable()
export class WorkflowEventEmitterService {
  constructor(private eventEmitter: EventEmitter2) {}

  emit<TEvent extends TEventName>(
    eventName: TEvent,
    eventData: ExtractWorkflowEventData<TEvent>,
    config?: EventConfig,
  ) {
    config = { ...DEFAULT_CONFIG, ...(config || {}) };

    if (!eventName) {
      throw new Error('Event name is required');
    }

    this.eventEmitter.emit(eventName, eventData, config);
  }

  on<TEvent extends TEventName>(
    eventName: TEvent,
    listener: (eventData: ExtractWorkflowEventData<TEvent>, config: EventConfig) => Promise<void>,
  ) {
    if (!eventName) {
      throw new Error('Event name is required');
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.eventEmitter.on(eventName, listener);
  }
}
