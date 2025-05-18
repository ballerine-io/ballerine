import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { AssessmentsService } from './assessments.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@common.Controller('external/assessments')
@ApiBearerAuth()
@swagger.ApiTags('Assessments')
export class AssessmentsControllerExternal {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @common.Get('/latest-by-workflow-runtime-data-id/:workflowRuntimeDataId')
  @swagger.ApiOperation({ summary: 'Get latest assessment by workflow runtime data id' })
  @swagger.ApiResponse({
    status: 200,
    description: 'Successfully returned latest assessment by workflow runtime data id',
  })
  @swagger.ApiResponse({ status: 500, description: 'Internal server error' })
  async getLatestAssessmentsByWorkflowRuntimeDataId(
    @common.Param('workflowRuntimeDataId') workflowRuntimeDataId: string,
    @common.Query('projectId') projectId: string,
  ) {
    const assessments = await this.assessmentsService.getLatestAssessmentsByWorkflowRuntimeDataId({
      workflowRuntimeDataId,
      projectId,
    });

    return assessments;
  }
}
