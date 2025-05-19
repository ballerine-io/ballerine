import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CurrentProject } from '@/common/decorators/current-project.decorator';
import type { TProjectId } from '@/types';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dtos/create-assessment.dto';
import { GetAssessmentsDto } from './dtos/get-assessments.dto';
import { GetKybAndOwnershipAssessmentsDto } from './dtos/get-kyb-and-ownership-assessments.dto';

@ApiBearerAuth()
@swagger.ApiTags('Assessments')
@common.Controller('external/assessments')
export class AssessmentsControllerExternal {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @common.Get()
  @swagger.ApiOperation({ summary: 'Get assessments' })
  @swagger.ApiResponse({ status: 200, description: 'Successfully retrieved assessments' })
  @swagger.ApiResponse({ status: 500, description: 'Internal server error' })
  getAssessments(@common.Query() query: GetAssessmentsDto) {
    return this.assessmentsService.getAssessments(query);
  }

  @common.Get('/kyb_and_ownership')
  @swagger.ApiOperation({ summary: 'Get KYB & Ownership assessments' })
  @swagger.ApiResponse({
    status: 200,
    description: 'Successfully retrieved KYB & Ownership assessments',
  })
  @swagger.ApiResponse({ status: 500, description: 'Internal server error' })
  getKybAndOwnershipAssessments(
    @common.Query() query: GetKybAndOwnershipAssessmentsDto,
    @CurrentProject() projectId: TProjectId,
  ) {
    return this.assessmentsService.getKybAndOwnershipAssessments(query, projectId);
  }

  @common.Post('')
  @swagger.ApiOperation({ summary: 'Create KYB & Ownership assessment' })
  @swagger.ApiResponse({
    status: 201,
    description: 'Successfully created KYB & Ownership assessment',
  })
  @swagger.ApiResponse({ status: 500, description: 'Internal server error' })
  createKybAndOwnershipAssessment(
    @common.Body() body: CreateAssessmentDto,
    @CurrentProject() projectId: TProjectId,
  ) {
    return this.assessmentsService.createAssessment(body, projectId);
  }
}
