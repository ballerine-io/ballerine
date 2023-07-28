import { Controller, Post, Query } from '@nestjs/common';
import { AppGateway } from '@/app.gateway';
import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum NotificationType {
  FILTERS = 'filters',
  WORKFLOWS = 'workflow',
  WORKFLOWS_LIST = 'workflows_list',
}

export class NotifyParams {
  @IsString()
  @IsEnum(NotificationType)
  @IsDefined()
  @IsNotEmpty()
  type: NotificationType;
}

@Controller('notify')
export class NotifyController {
  constructor(private readonly appGateway: AppGateway) {}

  @Post()
  notifyAllConnectedWebsockets(@Query() notifyParams: NotifyParams): string {
    this.appGateway.broadcast('notify', notifyParams.type);
    return '200';
  }
}
