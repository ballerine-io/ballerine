import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { WorkflowRuntimeData } from '@prisma/client';

export interface WorkflowEventRawData {
  runtimeData: WorkflowRuntimeData;
  state: string;
  context: {
    documents: any[];
    entity: any;
  };
  entityId: string;
  correlationId: string;
}

export interface WorkflowEventData {
  // TODO: Move to a shared package
  entityId: string;
  workflowDefinitionId: string;
  workflowDefinitionVersion: number;
  state: string;
  result: unknown;
  context: any;
}

@Injectable()
export class WorkflowEventEmitterService {
  constructor(private eventEmitter: EventEmitter2) {}

  emit(eventName: string, eventData: WorkflowEventRawData) {
    if (!eventName) {
      throw new Error('Event name is required');
    }

    this.eventEmitter.emit(eventName, eventData);
  }

  on(eventName: string, listener: (eventData: WorkflowEventRawData) => Promise<void>) {
    if (!eventName) {
      throw new Error('Event name is required');
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.eventEmitter.on(eventName, listener);
  }
}
