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
      await this.prismaService.$transaction(async transaction => {
        const { config } = await this.workflowService.getWorkflowRuntimeDataById(
          tokenScope.workflowRuntimeDataId,
          {},
          [tokenScope.projectId],
        );

        this.validateSignupInputByConfig(payload, config?.collectionFlow?.signup);

        const endUser = await this.endUserService.create(
          {
            data: { ...payload, projectId: tokenScope.projectId },
          },
          transaction,
        );

        await this.workflowTokenService.updateByToken(
          tokenScope.token,
          { endUserId: endUser.id },
          transaction,
        );
      });
    } catch (error: unknown) {
      if (error instanceof common.BadRequestException) {
        throw error;
      }

      throw new common.InternalServerErrorException(error, 'Failed to process signup');
    }
  }

  private validateSignupInputByConfig(payload: SignupDto, config: SignupConfig) {
    if (!config) {
      return;
    }

    if (config.email?.validation) {
      if (!isEmailValid(payload.email)) {
        throw new common.BadRequestException('Invalid email');
      }
    }
  }
}

const isEmailValid = (email: string) => {
  // @TODO: Implement email validation logic in the future
  return true;
};
