import { Module } from '@nestjs/common';
import { FilterControllerInternal } from '@/filter/filter.controller.internal';
import { FilterControllerExternal } from '@/filter/filter.controller.external';
import { FilterRepository } from '@/filter/filter.repository';
import { FilterService } from '@/filter/filter.service';
import { WebsocketNotifierService } from '@/common/websocket/notifier/websocket-notifier.service';

@Module({
  controllers: [FilterControllerInternal, FilterControllerExternal],
  providers: [FilterRepository, FilterService, WebsocketNotifierService],
})
export class FilterModule {}
