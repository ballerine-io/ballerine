import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AssessmentsService } from './assessments.service';

import { CurrentProject } from '@/common/decorators/current-project.decorator';
import type { TProjectId } from '@/types';
import { CreateAssessmentDto } from './dtos/create-assessment.dto';
import {
  GetKybAndOwnershipAssessmentsDto,
  GetKybAndOwnershipAssessmentsSchema,
} from './dtos/get-kyb-and-ownership-assessments.dto';
import type { UpdateableAssessmentStatus } from '@ballerine/common';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';

@ApiBearerAuth()
@swagger.ApiTags('Assessments')
@common.Controller('external/assessments')
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

  @common.Get('/:type')
  @swagger.ApiOperation({ summary: 'Get assessments' })
  @swagger.ApiResponse({
    status: 200,
    description: 'Successfully retrieved assessments',
  })
  @swagger.ApiResponse({ status: 500, description: 'Internal server error' })
  @common.UsePipes(new ZodValidationPipe(GetKybAndOwnershipAssessmentsSchema, 'query'))
  getAssessments(
    @common.Param('type') type: 'kyb_and_ownership' | 'company_sanctions',
    @common.Query() query: GetKybAndOwnershipAssessmentsDto,
    @CurrentProject() projectId: TProjectId,
  ) {
    return this.assessmentsService.getAssessments(type, query, projectId);
  }

  @common.Get('/by-id/:id')
  @swagger.ApiOperation({ summary: 'Get a specific assessment' })
  @swagger.ApiResponse({
    status: 200,
    description: 'Successfully retrieved assessment',
  })
  @swagger.ApiResponse({ status: 500, description: 'Internal server error' })
  getAssessment(@common.Param('id') id: string, @CurrentProject() projectId: TProjectId) {
    return this.assessmentsService.getAssessment(id, projectId);
  }

  @common.Post()
  @swagger.ApiOperation({ summary: 'Create an assessment' })
  @swagger.ApiResponse({
    status: 201,
    description: 'Successfully created an assessment',
  })
  @swagger.ApiResponse({ status: 500, description: 'Internal server error' })
  createAssessment(
    @common.Body() body: CreateAssessmentDto,
    @CurrentProject() projectId: TProjectId,
  ) {
    return this.assessmentsService.createAssessment(body, projectId);
  }

  @common.Put('/:id/status/:status')
  @swagger.ApiOperation({ summary: 'Update assessment status' })
  @swagger.ApiResponse({
    status: 200,
    description: 'Successfully updated assessment status',
  })
  @swagger.ApiResponse({ status: 500, description: 'Internal server error' })
  updateKybAndOwnershipAssessmentStatus(
    @common.Param('id') id: string,
    @common.Param('status') status: UpdateableAssessmentStatus,
    @CurrentProject() projectId: TProjectId,
  ) {
    return this.assessmentsService.updateAssessmentStatus(id, status, projectId);
  }
}
