import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { ExtractWorkflowEventData, TEventName } from '@/workflow/types';

@Injectable()
export class WorkflowEventEmitterService {
  constructor(private eventEmitter: EventEmitter2) {}

  emit<TEvent extends TEventName>(eventName: TEvent, eventData: ExtractWorkflowEventData<TEvent>) {
    if (!eventName) {
      throw new Error('Event name is required');
    }

    this.eventEmitter.emit(eventName, eventData);
  }

  on<TEvent extends TEventName>(
    eventName: TEvent,
    listener: (eventData: ExtractWorkflowEventData<TEvent>) => Promise<void>,
  ) {
    if (!eventName) {
      throw new Error('Event name is required');
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.eventEmitter.on(eventName, listener);
  }
}
