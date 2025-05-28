import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { CustomerModule } from '@/customer/customer.module';
import { AssessmentsControllerExternal } from './assessments.controller.external';
import { AssessmentsService } from './assessments.service';

@Module({
  imports: [CustomerModule, HttpModule],
  controllers: [AssessmentsControllerExternal],
  providers: [AssessmentsService],
})
export class AssessmentsModule {}
