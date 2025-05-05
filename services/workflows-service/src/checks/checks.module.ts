import { Module } from '@nestjs/common';
import { ChecksService } from './checks.service';
import { ChecksControllerInternal } from './checks.controller.internal';
import { CustomerModule } from '@/customer/customer.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [CustomerModule, HttpModule],
  controllers: [ChecksControllerInternal],
  providers: [ChecksService],
})
export class ChecksModule {}
