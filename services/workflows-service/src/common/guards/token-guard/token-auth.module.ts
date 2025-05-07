import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { WorkflowAuthGuard } from '@/common/guards/workflow-guard/workflow-auth.guard';
import { Module } from '@nestjs/common';
import { CustomerService } from '@/customer/customer.service';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { CustomerRepository } from '@/customer/customer.repository';
import { ProjectScopeService } from '@/project/project-scope.service';
import { UiDefinitionRepository } from '@/ui-definition/ui-definition.repository';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { ApiKeyService } from '@/customer/api-key/api-key.service';
import { ApiKeyRepository } from '@/customer/api-key/api-key.repository';
import { MerchantMonitoringClient } from '@/merchant-monitoring/merchant-monitoring.client';
import { WorkflowService } from '@/workflow/workflow.service';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { EndUserService } from '@/end-user/end-user.service';
import { BusinessReportService } from '@/business-report/business-report.service';
import { BusinessRepository } from '@/business/business.repository';
import { BusinessService } from '@/business/business.service';
import { EntityRepository } from '@/common/entity/entity.repository';
import { FileService } from '@/providers/file/file.service';
import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';
import { UserService } from '@/user/user.service';
import { SalesforceService } from '@/salesforce/salesforce.service';
import { RiskRuleService } from '@/rule-engine/risk-rule.service';
import { RuleEngineService } from '@/rule-engine/rule-engine.service';
import { SentryService } from '@/sentry/sentry.service';
import { SecretsManagerFactory } from '@/secrets-manager/secrets-manager.factory';
import { StorageService } from '@/storage/storage.service';
import { WorkflowLogService } from '@/workflow/workflow-log.service';
import { UserRepository } from '@/user/user.repository';
import { PasswordService } from '@/auth/password/password.service';
import { SalesforceIntegrationRepository } from '@/salesforce/salesforce-integration.repository';
import { NotionService } from '@/notion/notion.service';
import { FileRepository } from '@/storage/storage.repository';
import { WebhookHttpService } from '@/alert/webhook-manager/webhook-manager.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { WorkflowRuntimeDataActorService } from '@/workflow/workflow-runtime-data-actor.service';

@Module({
  imports: [HttpModule],
  providers: [
    MerchantMonitoringClient,
    WorkflowTokenRepository,
    WorkflowTokenService,
    WorkflowAuthGuard,
    CustomerService,
    CustomerRepository,
    UiDefinitionService,
    ProjectScopeService,
    UiDefinitionRepository,
    WorkflowRuntimeDataRepository,
    ApiKeyService,
    ApiKeyRepository,
    WorkflowService,
    WorkflowDefinitionRepository,
    EntityRepository,
    EndUserService,
    EndUserRepository,
    BusinessService,
    BusinessRepository,
    BusinessReportService,
    FileService,
    FileRepository,
    UserService,
    UserRepository,
    {
      provide: WebhookHttpService,
      useExisting: HttpService,
    },
    SalesforceService,
    SalesforceIntegrationRepository,
    RiskRuleService,
    RuleEngineService,
    SentryService,
    StorageService,
    WorkflowLogService,
    NotionService,
    PasswordService,
    SecretsManagerFactory,
    WorkflowEventEmitterService,
    WorkflowRuntimeDataActorService,
  ],
  exports: [WorkflowTokenRepository, WorkflowTokenService, WorkflowAuthGuard],
})
export class TokenAuthModule {}
