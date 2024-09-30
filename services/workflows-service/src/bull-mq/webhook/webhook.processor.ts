import { InjectQueue, OnQueueEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import axios, { AxiosRequestConfig } from 'axios';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { WebhookJobData } from '@/bull-mq/webhook/types/types';
import { QUEUES } from '@/bull-mq/consts';

@Processor(QUEUES.INCOMING_WEBHOOKS_QUEUE.name)
export class WebhookProcessor extends WorkerHost {
  constructor(
    protected readonly logger: AppLoggerService,
    @InjectQueue(QUEUES.INCOMING_WEBHOOKS_QUEUE.name) private webhookQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<WebhookJobData>) {
    this.logger.log(`Processing webhook job ${job.id}`);

    const { url, method, headers, body, timeout } = job.data;

    const config: AxiosRequestConfig = {
      url,
      method,
      headers,
      data: body,
      timeout: timeout || 5000, // Default timeout of 5 seconds
    };

    try {
      const response = await axios(config);

      return {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Webhook request failed: ${error.message}`);
      }

      throw error;
    }
  }

  @OnQueueEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Webhook job ${job.id} completed successfully`);
  }

  @OnQueueEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Webhook job ${job.id} failed: ${error.message}`);
  }

  async onModuleInit() {
    this.webhookQueue.on('cleaned', (jobs, type) => {
      this.logger.log(`${jobs.length} ${type} jobs have been cleaned from the webhook queue`);
    });
  }
}
