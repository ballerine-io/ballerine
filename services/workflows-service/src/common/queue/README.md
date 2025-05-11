# Queue System Documentation

## Overview

This module provides a robust queue system based on BullMQ for handling background tasks, scheduled jobs, and asynchronous operations. It includes integration with both BullBoard for UI monitoring and OpenTelemetry for metrics collection and monitoring.

## Features

- Job queuing and processing with BullMQ
- Persistent scheduled jobs (survives application restarts)
- Automatic worker detection for different environments
- BullBoard UI for monitoring queues and jobs
- OpenTelemetry metrics collection for monitoring with Prometheus

## Configuration

The queue system can be configured using the following environment variables:

```env
# Redis connection (used by BullMQ)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password

# Queue system configuration
QUEUE_SYSTEM_ENABLED=true    # Enable/disable the entire queue system
IS_QUEUE_WORKER=true         # Explicitly set this instance as a worker

# OpenTelemetry configuration
OTEL_ENABLED=true            # Enable BullMQ metrics collection via OpenTelemetry
```

## Worker Mode Configuration

The queue system intelligently determines when to register workers:

1. **Production Worker Mode**: When `IS_QUEUE_WORKER=true`, the instance always registers workers regardless of environment
2. **Production API Mode**: When `IS_QUEUE_WORKER` is not true and not in local environment, workers are not registered 
3. **Local Development Mode**: When `ENVIRONMENT_NAME=local`, workers are automatically registered unless explicitly disabled with `IS_QUEUE_WORKER=false`

## OpenTelemetry Metrics

When `OTEL_ENABLED=true`, the system will expose BullMQ metrics to OpenTelemetry, which can be collected by Prometheus. Available metrics include:

- `bullmq_jobs_completed_total`: Number of jobs completed
- `bullmq_jobs_failed_total`: Number of jobs failed  
- `bullmq_jobs_active`: Number of jobs currently active
- `bullmq_jobs_delayed`: Number of jobs currently delayed
- `bullmq_jobs_waiting`: Number of jobs currently waiting
- `bullmq_jobs_duration_seconds`: Job processing time histogram
- `bullmq_scheduler_jobs_total`: Number of scheduled jobs

## Usage Example

To create a queue and register a worker:

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { QueueService } from '@/common/queue/queue.service';

@Injectable()
export class MyService implements OnModuleInit {
  private readonly QUEUE_NAME = 'my-queue';
  
  constructor(private readonly queueService: QueueService) {}
  
  async onModuleInit() {
    // Create or get the queue
    const queue = this.queueService.getQueue({
      name: this.QUEUE_NAME,
      jobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      },
    });
    
    // Register worker - will only register if appropriate for this instance
    this.queueService.registerWorker(
      this.QUEUE_NAME,
      async (job) => {
        // Process job here
        return { result: 'success' };
      },
      { concurrency: 2 }
    );
    
    // Set up a scheduled job
    await this.queueService.setupJobScheduler(
      queue,
      'my-scheduled-job',
      {
        every: 60 * 60 * 1000, // Every hour
        jobName: 'hourly-task',
        data: { timestamp: Date.now() },
      }
    );
  }
}
``` 