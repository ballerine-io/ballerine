import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { HttpModule } from '@nestjs/axios';
import { Inject, MiddlewareConsumer, Module } from '@nestjs/common';

import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { BULLBOARD_INSTANCE_INJECTION_TOKEN, type BullBoardInjectedInstance } from './types/bull';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

@Module({
  imports: [AppLoggerModule, HttpModule],
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
  exports: [WebhooksService],
  controllers: [WebhooksController],
})
export class WebhooksModule {
  constructor(
    @Inject(BULLBOARD_INSTANCE_INJECTION_TOKEN)
    private bullBoard: BullBoardInjectedInstance,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer?.apply(this.bullBoard.serverAdapter.getRouter()).forRoutes('/queues');
  }
}
