import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { WorkflowRuntimeData } from '@prisma/client';

export interface WorkflowEventRawData {
  runtimeData: WorkflowRuntimeData;
  state: string;
  context: unknown;
}

export interface WorkflowEventData {
  // TODO: Move to a shared package
  entityId: string;
  workflowDefinitionId: string;
  workflowDefinitionVersion: number;
  state: string;
  result: unknown;
  context: unknown;
}

@Injectable()
export class WorkflowEventEmitterService {
  constructor(private eventEmitter: EventEmitter2) {}

  emit(eventName: string, { runtimeData, state, context }: WorkflowEventRawData) {
    if (!eventName) {
      throw new Error('Event name is required');
    }

    this.eventEmitter.emit(eventName, {
      context,
      entityId: runtimeData.endUserId, // TODO: rename to entityId
      workflowDefinitionId: runtimeData.workflowDefinitionId,
      workflowDefinitionVersion: runtimeData.workflowDefinitionVersion,
      state,
      result: context, // TODO: final result should be a subset of context, should be defined as part of the workflow definition
    });
  }
}
