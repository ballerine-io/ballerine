import { Controller, Post } from '@nestjs/common';
import { AppGateway } from '@/app.gateway';

@Controller('notify')
export class NotifyController {
  constructor(private readonly appGateway: AppGateway) {}

  @Post()
  notifyAllConnectedWebsockets(): string {
    this.appGateway.broadcast('notify', 'Hello World!');
    return '200';
  }
}
