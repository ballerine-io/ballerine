import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WebhookEvent } from './types';
import { WorkflowEventData } from '@/workflow/workflow-event-emitter.service';

@Injectable()
export class WebhooksService {
  constructor(private readonly httpService: HttpService, private eventEmitter: EventEmitter2) {
    this.eventEmitter.addListener('workflow.completed', (event: WorkflowEventData) => {
      const webhookEvent = event as unknown as WebhookEvent; // we should have mapping/transformer for this
      // should be workflow.*
      this.outgoingWebhooksHandler.bind(this)(webhookEvent).then(console.log).catch(console.error);
    });
  }

  async outgoingWebhooksHandler(event: WebhookEvent): Promise<any> {
    const data = await firstValueFrom(
      this.httpService
        .post('https://webhook.site/3f43af49-61d1-441b-add4-eeff29805a8c', event)
        .pipe(
          catchError((error: any) => {
            console.log(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }
}
