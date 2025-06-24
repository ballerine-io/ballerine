import { Module } from '@nestjs/common';
import { BullMQQueueService } from './queue.service';
import { QueueBullboardService } from './queue-bullboard.service';
import { QueueOtelService } from './otel.service';
import { MonitoringModule } from '@/common/monitoring/monitoring.module';
import { BULLBOARD_INSTANCE_INJECTION_TOKEN } from './types';
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [MonitoringModule, RedisModule],
  providers: [
    BullMQQueueService,
    { provide: 'IQueueService', useExisting: BullMQQueueService },
    QueueBullboardService,
    QueueOtelService,
    {
      provide: BULLBOARD_INSTANCE_INJECTION_TOKEN,
      useFactory: () => {
        const serverAdapter = new ExpressAdapter();
        serverAdapter.setBasePath('/api/queues');
        const boardInstance = createBullBoard({ queues: [], serverAdapter });

        return { boardInstance, serverAdapter };
      },
    },
  ],
  exports: [
    BullMQQueueService,
    'IQueueService',
    QueueBullboardService,
    QueueOtelService,
    BULLBOARD_INSTANCE_INJECTION_TOKEN,
  ],
})
export class QueueModule {}
