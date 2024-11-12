import * as common from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

import { SignupDto } from '@/collection-flow/dto/signup.dto';
import { WorkflowService } from '@/workflow/workflow.service';
import { type ITokenScope, TokenScope } from '@/common/decorators/token-scope.decorator';
import { UseTokenWithoutEnduserAuthGuard } from '@/common/guards/token-guard-without-enduser/token-without-enduser-auth.decorator';
import { EndUserService } from '@/end-user/end-user.service';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { isObject } from '@ballerine/common';

@UseTokenWithoutEnduserAuthGuard()
@ApiExcludeController()
@common.Controller('collection-flow/signup')
export class CollectionFlowSignupController {
  constructor(
    protected readonly endUserService: EndUserService,
    protected readonly workflowService: WorkflowService,
    protected readonly workflowTokenService: WorkflowTokenService,
  ) {}

  @common.Post()
  async signUp(@TokenScope() tokenScope: ITokenScope, @common.Body() payload: SignupDto) {
    const { config } = await this.workflowService.getWorkflowRuntimeDataById(
      tokenScope.workflowRuntimeDataId,
      {},
      [tokenScope.projectId],
    );

    this.validateSignupInputByConfig(payload, config?.collectionFlow?.signup);

    const endUser = await this.endUserService.create({
      data: { ...payload, projectId: tokenScope.projectId },
    });

    await this.workflowTokenService.updateByToken(tokenScope.token, { endUserId: endUser.id });
  }

  private validateSignupInputByConfig(payload: SignupDto, config: unknown) {
    if (!config) {
      return;
    }

    if (isObject(config) && 'email' in config && config.email.validation) {
      if (!isEmailValid(payload.email)) {
        throw new common.BadRequestException('Invalid email');
      }
    }
  }
}

const isEmailValid = (email: string) => {
  return true;
};
