import { TProjectId } from '@/types';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetKybAndOwnershipAssessmentsDto } from './dtos/get-kyb-and-ownership-assessments.dto';
import { CustomerService } from '@/customer/customer.service';
import { UnifiedApiClient } from '@/common/utils/unified-api-client/unified-api-client';
import { UpdateableAssessmentStatus } from '@ballerine/common';
import { CreateAssessmentDto } from './dtos/create-assessment.dto';

@Injectable()
export class AssessmentsService {
  constructor(
    protected readonly unifiedApiClient: UnifiedApiClient,
    protected readonly customerService: CustomerService,
  ) {}

  async getAssessments(
    type: 'kyb_and_ownership' | 'company_sanctions',
    query: GetKybAndOwnershipAssessmentsDto,
    projectId: TProjectId,
  ) {
    try {
      const queryParams = {
        page: query.page.number,
        limit: query.page.size,
      };

      const result = await new UnifiedApiClient().getAssessmentsByType(
        type,
        projectId,
        queryParams,
      );

      return result.data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAssessment(id: string, projectId: TProjectId) {
    try {
      const result = await new UnifiedApiClient().getAssessmentById(id, projectId);

      return result.data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createAssessment(
    { country, state, ...payload }: CreateAssessmentDto,
    projectId: TProjectId,
  ) {
    try {
      const data = {
        ...payload,
        country: [country, state].filter(Boolean).join('-'),
        projectId,
      };

      const result = await new UnifiedApiClient().createAssessment(payload.type, data);

      return result.data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateAssessmentStatus(
    id: string,
    status: UpdateableAssessmentStatus,
    projectId: TProjectId,
  ) {
    try {
      const result = await new UnifiedApiClient().updateAssessmentStatus(id, status, projectId);

      return result.data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getLatestAssessmentsByWorkflowRuntimeDataId({
    workflowRuntimeDataId,
    projectId,
  }: {
    workflowRuntimeDataId: string;
    projectId: string;
  }) {
    return await this.unifiedApiClient.getLatestAssessmentsByWorkflowRuntimeDataId({
      workflowRuntimeDataId,
      projectId,
    });
  }
}
