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
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const subscribePromisefied = promisify(eventConsumer.subscribe).bind(eventConsumer);
    const p = subscribePromisefied('workflow.completed').then(eventData => {
      expect(eventData.context.testme).toBeDefined();
    });

    workflowEventEmitter.emit('workflow.completed', {
      runtimeData: {} as WorkflowRuntimeData,
      state: '',
      context: { testme: 'testme' },
    });
    return p;
  });
});
