import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { Injectable } from '@nestjs/common';
import { env } from '@/env';
import axios from 'axios';

export enum NotificationType {
  FILTERS = 'filters',
  WORKFLOWS_LIST = 'workflows_list,',
}

@Injectable()
export class WebsocketNotifierService {
  constructor(private readonly logger: AppLoggerService) {}

  notify(notificationType: NotificationType) {
    const websocketServerNotifyUri = `${env.WEBSOCKET_URL}/notify?type=${notificationType}`;

    try {
      void axios.post(websocketServerNotifyUri);
    } catch (e) {
      this.logger.warn('Failed to notify websocket server');
    }
  }
}
