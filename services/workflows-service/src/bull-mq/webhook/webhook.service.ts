import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { WebhookJobData } from './webhook.processor'; // You might want to move this interface to a separate file

@Injectable()
export class WebhookService {
  constructor(@InjectQueue('webhook-queue') private webhookQueue: Queue) {}

  async addWebhookJob(data: WebhookJobData) {
    await this.webhookQueue.add('webhook', data);
  }
}
