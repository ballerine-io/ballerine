import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessRepository } from './business.repository';
import { BusinessControllerInternal } from './business.controller.internal';
import { BusinessControllerExternal } from './business.controller.external';
import { FilterService } from '@/filter/filter.service';
import { FilterRepository } from '@/filter/filter.repository';
import { WorkflowService } from '@/workflow/workflow.service';

@Module({
  controllers: [BusinessControllerInternal, BusinessControllerExternal],
  providers: [
    WorkflowService,
    BusinessRepository,
    BusinessService,
    FilterRepository,
    FilterService,
  ],
})
export class BusinessModule {}
