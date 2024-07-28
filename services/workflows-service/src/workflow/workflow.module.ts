// eslint-disable-next-line import/no-cycle
import { BusinessReportModule } from '@/business-report/business-report.module';
import { AuthModule } from '@/auth/auth.module';
import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { BusinessModule } from '@/business/business.module';
import { BusinessRepository } from '@/business/business.repository';
import { BusinessService } from '@/business/business.service';
import { ACLModule } from '@/common/access-control/acl.module';
import { EntityRepository } from '@/common/entity/entity.repository';
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
import { UiDefinitionRepository } from '@/ui-definition/ui-definition.repository';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { UserRepository } from '@/user/user.repository';
import { UserService } from '@/user/user.service';
import { WorkflowDefinitionModule } from '@/workflow-defintion/workflow-definition.module';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { HookCallbackHandlerService } from '@/workflow/hook-callback-handler.service';
import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { WorkflowControllerExternal } from '@/workflow/workflow.controller.external';
import { WorkflowControllerInternal } from '@/workflow/workflow.controller.internal';
import { WorkflowService } from '@/workflow/workflow.service';
import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { AlertModule } from '@/alert/alert.module';
import { DataAnalyticsModule } from '@/data-analytics/data-analytics.module';
import { AlertDefinitionModule } from '@/alert-definition/alert-definition.module';
import { BusinessReportService } from '@/business-report/business-report.service';
import { RuleEngineModule } from '@/rule-engine/rule-engine.module';
import { SentryService } from '@/sentry/sentry.service';
import { SecretsManagerModule } from '@/secrets-manager/secrets-manager.module';

@Module({
  controllers: [WorkflowControllerExternal, WorkflowControllerInternal],
  imports: [
    ACLModule,
    forwardRef(() => AuthModule),
    HttpModule,
    ProjectModule,
    PrismaModule,
    CustomerModule,
    forwardRef(() => BusinessReportModule),
    WorkflowDefinitionModule,
    AlertModule,
    BusinessModule,
    DataAnalyticsModule,
    AlertDefinitionModule,
    RuleEngineModule,
    SecretsManagerModule,
  ],
  providers: [
    WorkflowDefinitionRepository,
    WorkflowRuntimeDataRepository,
    ProjectScopeService,
    EndUserRepository,
    EndUserService,
    BusinessReportService,
    BusinessRepository,
    BusinessService,
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
    UiDefinitionRepository,
    UiDefinitionService,
    SentryService,
  ],
  exports: [
    WorkflowService,
    HookCallbackHandlerService,
    ACLModule,
    AuthModule,
    StorageService,
    FileRepository,
    EndUserService,
    EndUserRepository,
    WorkflowDefinitionService,
    FilterService,
    ProjectScopeService,
    WorkflowTokenService,
  ],
})
export class WorkflowModule {}
