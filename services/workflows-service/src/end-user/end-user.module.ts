import { Module } from '@nestjs/common';
import { EndUserControllerExternal } from './end-user.controller.external';
import { EndUserControllerInternal } from './end-user.controller.internal';
import { EndUserRepository } from './end-user.repository';
import { EndUserService } from './end-user.service';
import { FilterService } from '@/filter/filter.service';
import { FilterRepository } from '@/filter/filter.repository';
import { WorkflowService } from '@/workflow/workflow.service';

@Module({
  controllers: [EndUserControllerInternal, EndUserControllerExternal],
  providers: [WorkflowService, EndUserRepository, EndUserService, FilterService, FilterRepository],
})
export class EndUserModule {}
