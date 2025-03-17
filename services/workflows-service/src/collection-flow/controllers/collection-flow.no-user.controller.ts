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
import set from 'lodash/set';
import { CollectionFlowService } from '../collection-flow.service';
import { GetFlowConfigurationInputDto } from '../dto/get-flow-configuration-input.dto';
import { FlowConfigurationModel } from '../models/flow-configuration.model';

@UseTokenWithoutEnduserAuthGuard()
@ApiExcludeController()
@common.Controller('collection-flow/no-user')
export class CollectionFlowNoUserController {
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
      tokenScope,
      workflow.uiDefinitionId ? { where: { id: workflow.uiDefinitionId } } : {},
    );
  }

  @common.Post()
  async signUp(
    @TokenScope() tokenScope: ITokenScope,
    @common.Body() { additionalInfo, ...payload }: SignupDto,
  ) {
    try {
      const { workflowDefinitionId, context } =
        await this.workflowService.getWorkflowRuntimeDataById(
          tokenScope.workflowRuntimeDataId,
          { select: { workflowDefinitionId: true, context: true } },
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
            data: {
              ...payload,
              // @ts-ignore -- known issue with Prisma's JSON type
              additionalInfo,
              projectId: tokenScope.projectId,
            },
          },
          transaction,
        );

        await this.workflowTokenService.updateByToken(
          tokenScope.token,
          { endUser: { connect: { id: endUser.id } } },
          transaction,
        );

        const contextClone = structuredClone(context);

        const mainRepresentative = {
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          additionalInfo,
        };

        set(contextClone, 'entity.data.additionalInfo.mainRepresentative', {
          ...mainRepresentative,
          ballerineEntityId: endUser.id,
        });
        set(contextClone, 'data.additionalInfo.mainRepresentative', mainRepresentative);

        await transaction.workflowRuntimeData.updateMany({
          where: { id: tokenScope.workflowRuntimeDataId, projectId: tokenScope.projectId },
          data: { context: contextClone },
        });
      });
    } catch (error: unknown) {
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
