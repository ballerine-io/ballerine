import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { NotifyController } from '@/notifications/notify.controller';

@Module({
  imports: [],
  controllers: [AppController, NotifyController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
