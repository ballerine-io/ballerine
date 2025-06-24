import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueBullboardService } from './queue-bullboard.service';
import { QueueOtelService } from './otel.service';
import { redisProvider } from './redis.provider';

@Module({
  providers: [QueueService, QueueBullboardService, QueueOtelService, redisProvider],
  exports: [QueueService, QueueBullboardService, QueueOtelService, redisProvider],
})
export class QueueModule {}
