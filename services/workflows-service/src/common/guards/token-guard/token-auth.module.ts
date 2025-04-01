import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { TokenAuthGuard } from '@/common/guards/token-guard/token-auth.guard';
import { CombinedAuthGuard } from '@/common/guards/combined-auth.guard';
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

@Module({
  providers: [
    MerchantMonitoringClient,
    WorkflowTokenRepository,
    WorkflowTokenService,
    TokenAuthGuard,
    CombinedAuthGuard,
    CustomerService,
    CustomerRepository,
    UiDefinitionService,
    ProjectScopeService,
    UiDefinitionRepository,
    WorkflowRuntimeDataRepository,
    ApiKeyService,
    ApiKeyRepository,
    WorkflowService,
  ],
  exports: [WorkflowTokenRepository, WorkflowTokenService, TokenAuthGuard, CombinedAuthGuard],
})
export class TokenAuthModule {}
