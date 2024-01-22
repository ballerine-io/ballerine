import { CaseManagementService } from '@/case-management/case-management.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import type { AuthenticatedEntity, TProjectId, TProjectIds } from '@/types';
import { UserData } from '@/user/user-data.decorator';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { WorkflowRunDto } from '@/workflow/dtos/workflow-run';
import { WorkflowService } from '@/workflow/workflow.service';
import { Body, Controller, ForbiddenException, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('case-management')
export class CaseManagementController {
  constructor(
    protected readonly workflowDefinitionService: WorkflowDefinitionService,
    protected readonly workflowService: WorkflowService,
    protected readonly caseManagementService: CaseManagementService,
    protected readonly logger: AppLoggerService,
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
}
