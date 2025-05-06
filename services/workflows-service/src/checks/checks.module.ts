import { Module } from '@nestjs/common';
import { ChecksService } from './checks.service';
import { CustomerModule } from '@/customer/customer.module';
import { HttpModule } from '@nestjs/axios';
import { ChecksControllerExternal } from './checks.controller.external';

@Module({
  imports: [CustomerModule, HttpModule],
  controllers: [ChecksControllerExternal],
  providers: [ChecksService],
})
export class ChecksModule {}
