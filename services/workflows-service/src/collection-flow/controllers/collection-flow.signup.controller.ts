import * as common from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { SignupConfig } from '@/collection-flow/controllers/types';
import { SignupDto } from '@/collection-flow/dto/signup.dto';
import { type ITokenScope, TokenScope } from '@/common/decorators/token-scope.decorator';
import { UseTokenWithoutEnduserAuthGuard } from '@/common/guards/token-guard-without-enduser/token-without-enduser-auth.decorator';
import { EndUserService } from '@/end-user/end-user.service';
import { PrismaService } from '@/prisma/prisma.service';
import { WorkflowService } from '@/workflow/workflow.service';
import { CollectionFlowService } from '../collection-flow.service';
import { GetFlowConfigurationInputDto } from '../dto/get-flow-configuration-input.dto';
import { FlowConfigurationModel } from '../models/flow-configuration.model';

@UseTokenWithoutEnduserAuthGuard()
@ApiExcludeController()
@common.Controller('collection-flow/signup')
export class CollectionFlowSignupController {
  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly endUserService: EndUserService,
    protected readonly workflowService: WorkflowService,
    protected readonly workflowTokenService: WorkflowTokenService,
    protected readonly collectionFlowService: CollectionFlowService,
  ) {}

  @common.Get('/configuration/:language')
  async getFlowConfiguration(
    @TokenScope() tokenScope: ITokenScope,
    @common.Param() params: GetFlowConfigurationInputDto,
  ): Promise<FlowConfigurationModel> {
    const workflow = await this.collectionFlowService.getActiveFlow(
      tokenScope.workflowRuntimeDataId,
      [tokenScope.projectId],
    );

    if (!workflow) {
      throw new common.InternalServerErrorException('Workflow not found.');
    }

    return this.collectionFlowService.getFlowConfiguration(
      workflow.workflowDefinitionId,
      workflow.context,
      params.language,
      [tokenScope.projectId],
      workflow.uiDefinitionId ? { where: { id: workflow.uiDefinitionId } } : {},
    );
  }

  @common.Post('')
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
