import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { WebhookJobData } from '@/bull-mq/webhook/types/types';

@Injectable()
export class WebhookService {
  constructor(@InjectQueue('webhook-queue') private webhookQueue: Queue) {}

  async addWebhookJob(data: WebhookJobData) {
    await this.webhookQueue.add('webhook', data);
  }
}
