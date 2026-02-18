import { TProjectId } from '@/types';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetKybAndOwnershipAssessmentsDto } from './dtos/get-kyb-and-ownership-assessments.dto';
import { CustomerService } from '@/customer/customer.service';
import { UnifiedApiClient } from '@/common/utils/unified-api-client/unified-api-client';
import { UpdateableAssessmentStatus } from '@ballerine/common';

@Injectable()
export class AssessmentsService {
  constructor(
    protected readonly unifiedApiClient: UnifiedApiClient,
    protected readonly customerService: CustomerService,
  ) {}

  async getKybAndOwnershipAssessments(
    query: GetKybAndOwnershipAssessmentsDto,
    projectId: TProjectId,
  ) {
    try {
      const queryParams = {
        page: query.page.number,
        limit: query.page.size,
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
      registrationNumber: string;
      companyName: string;
      country: string;
      state?: string;
      businessId?: string;
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
    customerId,
    projectId,
  }: {
    workflowRuntimeDataId: string;
    customerId?: string;
    projectId?: string;
  }) {
    let resolvedCustomerId = customerId;
    let resolvedProjectId = projectId;

    // Back-compat: some call sites pass Ballerine projectId (e.g. "project-sl-default")
    // while Unified API expects x-tenant-id/x-project-id (e.g. "mikashboks-default"/"sl-default").
    // If customerId is missing, infer both from the Ballerine project record.
    if ((!resolvedCustomerId || !resolvedProjectId) && projectId) {
      try {
        const customer = await this.customerService.getByProjectId(projectId);
        resolvedCustomerId ||= customer?.name;

        if (resolvedProjectId === projectId) {
          const project = (customer?.projects ?? []).find((p: any) => p.id === projectId);
          resolvedProjectId = project?.name || resolvedProjectId;
        }
      } catch {
        // Best-effort inference only.
      }
    }

    return await this.unifiedApiClient.getLatestAssessmentsByWorkflowRuntimeDataId({
      workflowRuntimeDataId,
      customerId: resolvedCustomerId,
      projectId: resolvedProjectId,
    });
  }
}
