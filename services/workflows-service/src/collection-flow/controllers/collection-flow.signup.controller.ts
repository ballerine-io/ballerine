import * as common from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

import { SignupDto } from '@/collection-flow/dto/signup.dto';
import { EndUserService } from '@/end-user/end-user.service';
import { WorkflowService } from '@/workflow/workflow.service';
import { SignupConfig } from '@/collection-flow/controllers/types';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { type ITokenScope, TokenScope } from '@/common/decorators/token-scope.decorator';
import { UseTokenWithoutEnduserAuthGuard } from '@/common/guards/token-guard-without-enduser/token-without-enduser-auth.decorator';
import { PrismaService } from '@/prisma/prisma.service';

@UseTokenWithoutEnduserAuthGuard()
@ApiExcludeController()
@common.Controller('collection-flow/signup')
export class CollectionFlowSignupController {
  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly endUserService: EndUserService,
    protected readonly workflowService: WorkflowService,
    protected readonly workflowTokenService: WorkflowTokenService,
  ) {}

  @common.Post()
  async signUp(@TokenScope() tokenScope: ITokenScope, @common.Body() payload: SignupDto) {
    try {
      const { workflowDefinitionId } = await this.workflowService.getWorkflowRuntimeDataById(
        tokenScope.workflowRuntimeDataId,
        { select: { workflowDefinitionId: true } },
        [tokenScope.projectId],
      );

      const { config } = await this.workflowService.getWorkflowDefinitionById(
        workflowDefinitionId,
        { select: { config: true } },
        [tokenScope.projectId],
      );

      validateSignupInputByConfig(payload, config?.collectionFlow?.signup);

      await this.prismaService.$transaction(async transaction => {
        const endUser = await this.endUserService.create(
          {
            data: { ...payload, projectId: tokenScope.projectId },
          },
          transaction,
        );

        await this.workflowTokenService.updateByToken(
          tokenScope.token,
          { endUser: { connect: { id: endUser.id } } },
          transaction,
        );
      });
    } catch (error) {
      if (error instanceof common.BadRequestException) {
        throw error;
      }

      throw new common.InternalServerErrorException(error, 'Failed to process signup');
    }
  }
}

const validateSignupInputByConfig = (payload: SignupDto, config: SignupConfig) => {
  if (!config) {
    return;
  }

  if (config.email?.verification && !isEmailVerified(payload.email)) {
    throw new common.BadRequestException('Invalid email');
  }
};

const isEmailVerified = (email: string) => {
  // @TODO: Implement email validation logic in the future
  return true;
};
