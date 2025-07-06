import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { HttpModule } from '@nestjs/axios';
import { Inject, MiddlewareConsumer, Module } from '@nestjs/common';

import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { QueueModule } from '@/common/queue/queue.module';
import { MonitoringModule } from '@/common/monitoring/monitoring.module';
import { BULLBOARD_INSTANCE_INJECTION_TOKEN } from '@/common/queue/types';
import type { BullBoardInjectedInstance } from '@/common/queue/types';
import { BullBoardAuthMiddleware } from './bull-board.auth.middleware';
import { WebhooksService } from './webhooks.service';

@Module({
  imports: [AppLoggerModule, HttpModule, QueueModule, MonitoringModule],
  providers: [
    WebhooksService,
    {
      provide: BULLBOARD_INSTANCE_INJECTION_TOKEN,
      useFactory: (): BullBoardInjectedInstance => {
        const serverAdapter = new ExpressAdapter();
        serverAdapter.setBasePath('/api/queues');

        const boardInstance = createBullBoard({ queues: [], serverAdapter });

        return { boardInstance, serverAdapter };
      },
    },
  ],
  exports: [WebhooksService, BULLBOARD_INSTANCE_INJECTION_TOKEN],
})
export class WebhooksModule {
  constructor(
    @Inject(BULLBOARD_INSTANCE_INJECTION_TOKEN)
    private bullBoard: BullBoardInjectedInstance,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BullBoardAuthMiddleware, this.bullBoard.serverAdapter.getRouter())
      .forRoutes('/api/queues');
  }
}
