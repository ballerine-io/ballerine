import { Injectable } from '@nestjs/common';
import { CustomerService } from '@/customer/customer.service';
import { UnifiedApiClient } from '@/common/utils/unified-api-client/unified-api-client';

@Injectable()
export class ChecksService {
  constructor(
    protected readonly unifiedApiClient: UnifiedApiClient,
    protected readonly customerService: CustomerService,
  ) {}

  async getLatestCheckByEndUserAndWorkflowRuntimeDataId({
    endUserId,
    workflowRuntimeDataId,
    projectId,
  }: {
    endUserId: string;
    workflowRuntimeDataId: string;
    projectId: string;
  }) {
    return await this.unifiedApiClient.getLatestCheckByEndUserAndWorkflowRuntimeDataId({
      endUserId,
      workflowRuntimeDataId,
      projectId,
    });
  }
}
