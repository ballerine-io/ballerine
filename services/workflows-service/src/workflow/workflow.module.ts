import { forwardRef, Module } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowControllerExternal } from './workflow.controller.external';
import { WorkflowControllerInternal } from './workflow.controller.internal';
import { ACLModule } from '@/common/access-control/acl.module';
import { AuthModule } from '@/auth/auth.module';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
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
import { WorkflowStateChangedWebhookCaller } from '@/events/workflow-state-changed-webhook-caller';
import { EntityRepository } from '@/common/entity/entity.repository';
import { HookCallbackHandlerService } from '@/workflow/hook-callback-handler.service';
import { WorkflowCompletedWebhookCaller } from '@/events/workflow-completed-webhook-caller';
import { ProjectScopeService } from '@/project/project-scope.service';
import { EndUserService } from '@/end-user/end-user.service';
import { ProjectModule } from '@/project/project.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { CustomerModule } from '@/customer/customer.module';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { SalesforceService } from '@/salesforce/salesforce.service';
import { SalesforceIntegrationRepository } from '@/salesforce/salesforce-integration.repository';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { WorkflowDefinitionModule } from '@/workflow-defintion/workflow-definition.module';

@Module({
  imports: [
    ACLModule,
    forwardRef(() => AuthModule),
    HttpModule,
    ProjectModule,
    PrismaModule,
    CustomerModule,
    WorkflowDefinitionModule,
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
    WorkflowDefinitionService,
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
