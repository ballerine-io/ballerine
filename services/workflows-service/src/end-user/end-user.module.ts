import { Module } from '@nestjs/common';
import { EndUserControllerExternal } from './end-user.controller.external';
import { EndUserControllerInternal } from './end-user.controller.internal';
import { EndUserRepository } from './end-user.repository';
import { EndUserService } from './end-user.service';
import { FilterService } from '@/filter/filter.service';
import { FilterRepository } from '@/filter/filter.repository';
import { WorkflowDefinitionRepository } from '@/workflow/workflow-definition.repository';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { WorkflowService } from '@/workflow/workflow.service';
import { BusinessRepository } from '@/business/business.repository';
import { StorageService } from '@/storage/storage.service';
import { FileService } from '@/providers/file/file.service';
import { FileRepository } from '@/storage/storage.repository';
import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';

@Module({
  controllers: [EndUserControllerInternal, EndUserControllerExternal],
  providers: [
    EndUserRepository,
    EndUserService,
    FilterService,
    FilterRepository,
    FileRepository,
    FileService,
    StorageService,
    WorkflowEventEmitterService,
    BusinessRepository,
    WorkflowDefinitionRepository,
    WorkflowRuntimeDataRepository,
    WorkflowService,
  ],
})
export class EndUserModule {}
