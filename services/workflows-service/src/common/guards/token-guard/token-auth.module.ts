import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { TokenAuthGuard } from '@/common/guards/token-guard/token-auth.guard';
import { Module } from '@nestjs/common';

@Module({
  providers: [WorkflowTokenRepository, WorkflowTokenService, TokenAuthGuard],
  exports: [WorkflowTokenRepository, WorkflowTokenService, TokenAuthGuard],
})
export class TokenAuthModule {}
