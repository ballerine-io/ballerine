// import { WorkflowEventData } from '@/workflow/workflow-event-emitter.service';
import { Injectable } from '@nestjs/common';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { ListenerFn } from './types';

@Injectable()
export class EventConsumerListener {
  constructor(private eventEmitter: EventEmitter2) {}

  subscribe(event: string, callback: ListenerFn) {
    this.eventEmitter.addListener(event, eventData => {
      callback(undefined, eventData);
    });
  }

  // OnEvent is not working, need to check why, for now we subscribe explicitly
  // @OnEvent('workflow.a')
  // handleWorkflowEvent(eventName: string, data: WorkflowEventData) {
  //   console.log('eeeee', eventName, data);
  // }
}
