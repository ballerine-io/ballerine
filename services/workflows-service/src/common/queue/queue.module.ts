import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueBullboardService } from './queue-bullboard.service';
import { QueueOtelService } from './otel.service';

@Module({
  providers: [QueueService, QueueBullboardService, QueueOtelService],
  exports: [QueueService, QueueBullboardService, QueueOtelService],
})
export class QueueModule {}
