import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueBullboardService } from './queue-bullboard.service';
import { QueueOtelService } from './otel.service';
import { redisProvider } from './redis.provider';
import { MonitoringModule } from '@/common/monitoring/monitoring.module';
import { BULLBOARD_INSTANCE_INJECTION_TOKEN } from './types';
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';

@Module({
  imports: [MonitoringModule],
  providers: [
    QueueService,
    QueueBullboardService,
    QueueOtelService,
    redisProvider,
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
    QueueService,
    QueueBullboardService,
    QueueOtelService,
    redisProvider,
    BULLBOARD_INSTANCE_INJECTION_TOKEN,
  ],
})
export class QueueModule {}
