import { CaseManagementService } from '@/case-management/case-management.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { TransactionService } from '@/transaction/transaction.service';
import type { AuthenticatedEntity, TProjectId, TProjectIds } from '@/types';
import { UserData } from '@/user/user-data.decorator';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { WorkflowRunDto } from '@/workflow/dtos/workflow-run';
import { WorkflowService } from '@/workflow/workflow.service';
import { Body, Controller, ForbiddenException, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiExcludeController, ApiForbiddenResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('case-management')
@ApiExcludeController()
export class CaseManagementController {
  constructor(
    protected readonly workflowDefinitionService: WorkflowDefinitionService,
    protected readonly workflowService: WorkflowService,
    protected readonly caseManagementService: CaseManagementService,
    protected readonly logger: AppLoggerService,
    protected readonly transactionService: TransactionService,
  ) {}

  @Get('workflow-definition/:workflowDefinitionId')
  async getCaseDefinitionById(
    @Param('workflowDefinitionId') workflowDefinitionId: string,
    @ProjectIds() projectIds: TProjectId[],
  ) {
    return this.workflowDefinitionService.getLatestVersion(workflowDefinitionId, projectIds);
  }

  @Post()
  @ApiOkResponse()
  @HttpCode(200)
  @ApiForbiddenResponse({ type: ForbiddenException })
  async createCase(
    @Body() body: WorkflowRunDto,
    @UserData() authenticatedEntity: AuthenticatedEntity,
    @ProjectIds() projectIds: TProjectIds,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    const result = await this.caseManagementService.create(body, projectIds!, currentProjectId);

    this.logger.log(
      `User ${authenticatedEntity?.user?.id} created workflow ${(await result).workflowRuntimeId}`,
    );

    return result;
  }

  @Get('transactions')
  async getTransactions(@CurrentProject() projectId: TProjectId) {
    return this.transactionService.getAll({}, projectId);
  }

  @Get('profiles/individuals')
  async listIndividualsProfiles(@CurrentProject() projectId: TProjectId) {
    return [
      {
        id: '1',
        createdAt: '2024-04-30T12:52:14.965Z',
        name: 'John Doe',
        business: 'ACME Inc.',
        role: 'UBO',
        kyc: 'COMPLETED',
        sanctions: 'MONITORED',
        alerts: 0,
        updatedAt: '2024-04-30T12:52:14.965Z',
      },
      {
        id: '2',
        createdAt: '2024-04-30T12:52:14.965Z',
        name: 'Jane Doe',
        business: 'ACME Inc.',
        role: 'DIRECTOR',
        kyc: 'PENDING',
        sanctions: 'NOT_MONITORED',
        alerts: 0,
        updatedAt: '2024-04-30T12:52:14.965Z',
      },
      {
        id: '3',
        createdAt: '2024-04-30T12:52:14.965Z',
        name: 'John Smith',
        business: 'ACME Inc.',
        role: 'AUTHORIZED_SIGNATORY',
        kyc: 'APPROVED',
        sanctions: 'MONITORED',
        alerts: 0,
        updatedAt: '2024-04-30T12:52:14.965Z',
      },
      {
        id: '4',
        createdAt: '2024-04-30T12:52:14.965Z',
        name: 'Bob Smith',
        business: 'ACME Inc.',
        role: 'AUTHORIZED_SIGNATORY',
        kyc: 'DECLINED',
        sanctions: 'NOT_MONITORED',
        alerts: 0,
        updatedAt: '2024-04-30T12:52:14.965Z',
      },
      {
        id: '5',
        createdAt: '2024-04-30T12:52:14.965Z',
        name: 'Alice Smith',
        business: 'ACME Inc.',
        role: 'AUTHORIZED_SIGNATORY',
        kyc: 'REVISIONS',
        sanctions: 'MONITORED',
        alerts: 0,
        updatedAt: '2024-04-30T12:52:14.965Z',
      },
    ] satisfies Array<{
      id: string;
      createdAt: string;
      name: string;
      business: string;
      role: string;
      kyc: string;
      sanctions: string;
      alerts: number;
      updatedAt: string;
    }>;
  }
}
