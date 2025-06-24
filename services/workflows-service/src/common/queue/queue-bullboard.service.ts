import { Injectable } from '@nestjs/common';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Queue } from 'bullmq';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';

@Injectable()
export class QueueBullboardService {
  constructor(private readonly logger: AppLoggerService) {}

  registerQueue(bullBoardInstance: any, queue: Queue) {
    try {
      const adapter = new BullMQAdapter(queue);
      const currentQueues = bullBoardInstance.boardInstance.queues || [];
      const existingAdapter = currentQueues.find((q: any) => q.queue.name === queue.name);
      if (existingAdapter) {
        this.logger.debug(`Queue ${queue.name} is already registered with BullBoard`);
        return;
      }
      bullBoardInstance.boardInstance.setQueues([...currentQueues, adapter]);
      this.logger.log(`Queue ${queue.name} registered with BullBoard`);
    } catch (error) {
      this.logger.error(`Error registering queue ${queue.name} with BullBoard`, { error });
    }
  }
}
