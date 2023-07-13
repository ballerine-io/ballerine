import { forwardRef, Module } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowControllerExternal } from './workflow.controller.external';
import { WorkflowControllerInternal } from './workflow.controller.internal';
import { ACLModule } from '@/common/access-control/acl.module';
import { AuthModule } from '../auth/auth.module';
import { WorkflowDefinitionRepository } from './workflow-definition.repository';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { WorkflowEventEmitterService } from './workflow-event-emitter.service';
import { DocumentChangedWebhookCaller } from '@/events/document-changed-webhook-caller';
import { BusinessRepository } from '@/business/business.repository';
import { FileService } from '@/providers/file/file.service';
import { StorageService } from '@/storage/storage.service';
import { FileRepository } from '@/storage/storage.repository';
import { HttpModule } from '@nestjs/axios';
import { FilterRepository } from '@/filter/filter.repository';
import { FilterService } from '@/filter/filter.service';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { UserService } from '@/user/user.service';
import { UserRepository } from '@/user/user.repository';

@Module({
  imports: [ACLModule, forwardRef(() => AuthModule), HttpModule],
  controllers: [WorkflowControllerExternal, WorkflowControllerInternal],
  providers: [
    WorkflowDefinitionRepository,
    WorkflowRuntimeDataRepository,
    EndUserRepository,
    BusinessRepository,
    StorageService,
    FileRepository,
    WorkflowService,
    FileService,
    WorkflowEventEmitterService,
    DocumentChangedWebhookCaller,
    FilterRepository,
    FilterService,
    UserService,
    UserRepository,
  ],
  exports: [WorkflowService, ACLModule, AuthModule, StorageService, FileRepository],
})
export class WorkflowModule {}
