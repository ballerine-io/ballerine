import { Module } from '@nestjs/common';
import { ChecksService } from './checks.service';
import { CustomerModule } from '@/customer/customer.module';
import { HttpModule } from '@nestjs/axios';
import { ChecksControllerExternal } from './checks.controller.external';
import { UnifiedApiClient } from '@/common/utils/unified-api-client/unified-api-client';

@Module({
  imports: [CustomerModule, HttpModule],
  controllers: [ChecksControllerExternal],
  providers: [ChecksService, UnifiedApiClient],
})
export class ChecksModule {}
