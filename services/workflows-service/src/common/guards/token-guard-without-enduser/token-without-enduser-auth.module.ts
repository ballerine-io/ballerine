import { Module } from '@nestjs/common';

import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { TokenWithoutEnduserAuthGuard } from '@/common/guards/token-guard-without-enduser/token-without-enduser-auth.guard';

@Module({
  providers: [WorkflowTokenRepository, WorkflowTokenService, TokenWithoutEnduserAuthGuard],
  exports: [WorkflowTokenRepository, WorkflowTokenService, TokenWithoutEnduserAuthGuard],
})
export class TokenWithoutEnduserAuthModule {}
