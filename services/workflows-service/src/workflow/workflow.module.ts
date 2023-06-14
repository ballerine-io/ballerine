import { forwardRef, Module } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowControllerExternal } from './workflow.controller.external';
import { WorkflowControllerInternal } from './workflow.controller.internal';
import { ACLModule } from '@/common/access-control/acl.module';
import { AuthModule } from '../auth/auth.module';
import { WorkflowDefinitionRepository } from './workflow-definition.repository';
import { WorkflowRuntimeDataRepository } from './workflow-runtime-data.repository';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { WorkflowEventEmitterService } from './workflow-event-emitter.service';
import { DocumentChangedWebhookCaller } from '@/events/document-changed-webhook-caller';
import { BusinessRepository } from '@/business/business.repository';
import { FileService } from '@/providers/file/file.service';
import { StorageService } from '@/storage/storage.service';
import { FileRepository } from '@/storage/storage.repository';
import { HttpModule, HttpService } from '@nestjs/axios';
import { FilterRepository } from '@/filter/filter.repository';
import { FilterService } from '@/filter/filter.service';

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
  ],
  exports: [WorkflowService, ACLModule, AuthModule, StorageService, FileRepository],
})
export class WorkflowModule {}
