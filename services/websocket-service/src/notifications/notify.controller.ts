import { Controller, Post, Query } from '@nestjs/common';
import { AppGateway } from '@/app.gateway';

@Controller('notify')
export class NotifyController {
  constructor(private readonly appGateway: AppGateway) {}

  @Post()
  // todo make it an enum
  notifyAllConnectedWebsockets(@Query('type') notificationType: string): string {
    this.appGateway.broadcast('notify', notificationType);
    return '200';
  }
}
