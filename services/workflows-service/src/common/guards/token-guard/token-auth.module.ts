import { Module } from '@nestjs/common';

import { CustomerService } from '@/customer/customer.service';
import { ApiKeyService } from '@/customer/api-key/api-key.service';
import { CustomerRepository } from '@/customer/customer.repository';
import { ProjectScopeService } from '@/project/project-scope.service';
import { ApiKeyRepository } from '@/customer/api-key/api-key.repository';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { TokenAuthGuard } from '@/common/guards/token-guard/token-auth.guard';
import { UiDefinitionRepository } from '@/ui-definition/ui-definition.repository';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';

@Module({
  providers: [
    WorkflowTokenRepository,
    WorkflowTokenService,
    TokenAuthGuard,
    CustomerService,
    CustomerRepository,
    UiDefinitionService,
    ProjectScopeService,
    UiDefinitionRepository,
    WorkflowRuntimeDataRepository,
    ApiKeyService,
    ApiKeyRepository,
  ],
  exports: [WorkflowTokenRepository, WorkflowTokenService, TokenAuthGuard],
})
export class TokenAuthModule {}
