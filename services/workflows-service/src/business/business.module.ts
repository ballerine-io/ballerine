import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessRepository } from './business.repository';
import { BusinessControllerInternal } from './business.controller.internal';
import { BusinessControllerExternal } from './business.controller.external';
import { FilterService } from '@/filter/filter.service';
import { FilterRepository } from '@/filter/filter.repository';
import { WorkflowDefinitionRepository } from '@/workflow/workflow-definition.repository';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { WorkflowService } from '@/workflow/workflow.service';
import { FileRepository } from '@/storage/storage.repository';
import { FileService } from '@/providers/file/file.service';
import { StorageService } from '@/storage/storage.service';
import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { EntityRepository } from '@/common/entity/entity.repository';
import { ProjectScopeService } from '@/project/project-scope.service';
import { HttpModule } from '@nestjs/axios';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { EndUserService } from '@/end-user/end-user.service';
import { ProjectModule } from '@/project/project.module';

@Module({
  imports: [HttpModule, AppLoggerModule, ProjectModule],
  controllers: [BusinessControllerInternal, BusinessControllerExternal],
  providers: [
    BusinessRepository,
    BusinessService,
    EntityRepository,
    FilterRepository,
    FilterService,
    FileRepository,
    FileService,
    StorageService,
    ProjectScopeService,
    EndUserRepository,
    EndUserService,
    WorkflowEventEmitterService,
    WorkflowDefinitionRepository,
    WorkflowRuntimeDataRepository,
    WorkflowService,
  ],
})
export class BusinessModule {}
