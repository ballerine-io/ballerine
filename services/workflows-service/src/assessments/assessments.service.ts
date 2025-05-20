import { TProjectId } from '@/types';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetKybAndOwnershipAssessmentsDto } from './dtos/get-kyb-and-ownership-assessments.dto';
import { UnifiedApiClient } from '@/common/utils/unified-api-client/unified-api-client';

@Injectable()
export class AssessmentsService {
  async getKybAndOwnershipAssessments(
    query: GetKybAndOwnershipAssessmentsDto,
    projectId: TProjectId,
  ) {
    try {
      const queryParams = {
        page: query.page,
        limit: query.limit,
      };

      const result = await new UnifiedApiClient().getAssessmentsByType(
        'kyb_and_ownership',
        projectId,
        queryParams,
      );

      return result.data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getKybAndOwnershipAssessment(id: string, projectId: TProjectId) {
    try {
      const result = await new UnifiedApiClient().getAssessmentById(id, projectId);

      return result.data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createAssessment(
    {
      country,
      state,
      ...payload
    }: {
      type: 'kyb_and_ownership';
      businessId: string;
      registrationNumber: string;
      companyName: string;
      country: string;
      state?: string;
    },
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
}
