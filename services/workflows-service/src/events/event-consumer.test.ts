import { EventConsumerListener } from './event-consumer';
import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';
import { Test } from '@nestjs/testing';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WorkflowRuntimeData } from '@prisma/client';
import { promisify } from 'util';

describe('Event Consumer', () => {
  it('should susbscribe to event thoughn the event manager the test emitteing workflow event', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [EventConsumerListener, WorkflowEventEmitterService],
    }).compile();

    const eventConsumer = moduleRef.get<EventConsumerListener>(EventConsumerListener);
    const workflowEventEmitter = moduleRef.get<WorkflowEventEmitterService>(
      WorkflowEventEmitterService,
    );

    workflowEventEmitter.emit('workflow.context.changed', {
      runtimeData: {} as WorkflowRuntimeData,
      state: '',
      context: { testme: 'testme' },
    });
  });
});
