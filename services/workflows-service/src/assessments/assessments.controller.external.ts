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
import type { Response } from 'express';
import { Observable, interval, from, switchMap, map, catchError, of } from 'rxjs';

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

  @common.Get('/kyb_and_ownership')
  @swagger.ApiOperation({ summary: 'Get KYB & Ownership assessments' })
  @swagger.ApiResponse({
    status: 200,
    description: 'Successfully retrieved KYB & Ownership assessments',
  })
  @swagger.ApiResponse({ status: 500, description: 'Internal server error' })
  @common.UsePipes(new ZodValidationPipe(GetKybAndOwnershipAssessmentsSchema, 'query'))
  getKybAndOwnershipAssessments(
    @common.Query() query: GetKybAndOwnershipAssessmentsDto,
    @CurrentProject() projectId: TProjectId,
  ) {
    return this.assessmentsService.getKybAndOwnershipAssessments(query, projectId);
  }

  @common.Get('/kyb_and_ownership/:id')
  @swagger.ApiOperation({ summary: 'Get a specific KYB & Ownership assessment' })
  @swagger.ApiResponse({
    status: 200,
    description: 'Successfully retrieved KYB & Ownership assessment',
  })
  @swagger.ApiResponse({ status: 500, description: 'Internal server error' })
  getKybAndOwnershipAssessment(
    @common.Param('id') id: string,
    @CurrentProject() projectId: TProjectId,
  ) {
    return this.assessmentsService.getKybAndOwnershipAssessment(id, projectId);
  }

  @common.Post()
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

  @common.Get('/kyb_and_ownership/:id/sse')
  @swagger.ApiOperation({ summary: 'Stream KYB & Ownership assessment updates via SSE' })
  @swagger.ApiResponse({
    status: 200,
    description: 'SSE stream for KYB & Ownership assessment updates',
  })
  @swagger.ApiResponse({ status: 500, description: 'Internal server error' })
  @common.Header('Content-Type', 'text/event-stream')
  @common.Header('Cache-Control', 'no-cache')
  @common.Header('Connection', 'keep-alive')
  streamKybAndOwnershipAssessment(
    @common.Param('id') id: string,
    @CurrentProject() projectId: TProjectId,
    @common.Res() res: Response,
  ): Observable<any> {
    // Send initial connection message
    res.write('data: {"type":"connected"}\n\n');

    // Create observable that polls for updates every 2 seconds
    return interval(2000).pipe(
      switchMap(() => from(this.assessmentsService.getKybAndOwnershipAssessment(id, projectId))),
      map(assessment => {
        const event = `data: ${JSON.stringify({ type: 'assessment-update', data: assessment })}\n\n`;
        res.write(event);
        return assessment;
      }),
      catchError(error => {
        const errorEvent = `data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`;
        res.write(errorEvent);
        return of(null);
      }),
    );
  }
}
