import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { BusinessRepository } from '@/business/business.repository';
import { ACLModule } from '@/common/access-control/acl.module';
import { EntityRepository } from '@/common/entity/entity.repository';
import { initHttpModule } from '@/common/http-service/http-config.service';
import { CustomerModule } from '@/customer/customer.module';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { EndUserService } from '@/end-user/end-user.service';
import { DocumentChangedWebhookCaller } from '@/events/document-changed-webhook-caller';
import { WorkflowCompletedWebhookCaller } from '@/events/workflow-completed-webhook-caller';
import { WorkflowStateChangedWebhookCaller } from '@/events/workflow-state-changed-webhook-caller';
import { FilterRepository } from '@/filter/filter.repository';
import { FilterService } from '@/filter/filter.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProjectScopeService } from '@/project/project-scope.service';
import { ProjectModule } from '@/project/project.module';
import { FileService } from '@/providers/file/file.service';
import { SalesforceIntegrationRepository } from '@/salesforce/salesforce-integration.repository';
import { SalesforceService } from '@/salesforce/salesforce.service';
import { FileRepository } from '@/storage/storage.repository';
import { StorageService } from '@/storage/storage.service';
import { UserRepository } from '@/user/user.repository';
import { UserService } from '@/user/user.service';
import { HookCallbackHandlerService } from '@/workflow/hook-callback-handler.service';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WorkflowDefinitionRepository } from './workflow-definition.repository';
import { WorkflowEventEmitterService } from './workflow-event-emitter.service';
import { WorkflowControllerExternal } from './workflow.controller.external';
import { WorkflowControllerInternal } from './workflow.controller.internal';
import { WorkflowService } from './workflow.service';

@Module({
  imports: [
    ACLModule,
    forwardRef(() => AuthModule),
    initHttpModule(),
    ProjectModule,
    PrismaModule,
    CustomerModule,
  ],
  controllers: [WorkflowControllerExternal, WorkflowControllerInternal],
  providers: [
    WorkflowDefinitionRepository,
    WorkflowRuntimeDataRepository,
    ProjectScopeService,
    EndUserRepository,
    EndUserService,
    BusinessRepository,
    EntityRepository,
    StorageService,
    FileRepository,
    WorkflowService,
    HookCallbackHandlerService,
    FileService,
    WorkflowEventEmitterService,
    DocumentChangedWebhookCaller,
    WorkflowCompletedWebhookCaller,
    WorkflowStateChangedWebhookCaller,
    FilterRepository,
    FilterService,
    UserService,
    UserRepository,
    WorkflowTokenRepository,
    WorkflowTokenService,
    SalesforceService,
    SalesforceIntegrationRepository,
  ],
  exports: [
    WorkflowService,
    HookCallbackHandlerService,
    ACLModule,
    AuthModule,
    StorageService,
    FileRepository,
  ],
})
export class WorkflowModule {}
