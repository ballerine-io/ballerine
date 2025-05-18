import { Module } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { CustomerModule } from '@/customer/customer.module';
import { HttpModule } from '@nestjs/axios';
import { AssessmentsControllerExternal } from './assessments.controller.external';
import { UnifiedApiClient } from '@/common/utils/unified-api-client/unified-api-client';

@Module({
  imports: [CustomerModule, HttpModule],
  controllers: [AssessmentsControllerExternal],
  providers: [AssessmentsService, UnifiedApiClient],
  exports: [AssessmentsService, UnifiedApiClient],
})
export class AssessmentsModule {}
