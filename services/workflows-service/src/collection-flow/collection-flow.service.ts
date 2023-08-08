import { CollectionFlowRepository } from '@/collection-flow/repository/collection-flow.repository';
import { GetLastActiveFlowParams } from '@/collection-flow/types';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { EndUserService } from '@/end-user/end-user.service';
import * as common from '@nestjs/common';
import { WorkflowRuntimeData } from '@prisma/client';

@common.Injectable()
export class CollectionFlowService {
  constructor(
    private readonly endUserService: EndUserService,
    private readonly collectionFlowRepository: CollectionFlowRepository,
    private readonly logger: AppLoggerService,
  ) {}

  async getLastActiveFlow({
    email,
    workflowRuntimeDefinitionId,
  }: GetLastActiveFlowParams): Promise<WorkflowRuntimeData | null> {
    const endUser = await this.endUserService.getByEmail(email);

    if (!endUser || !endUser.businesses.length) return null;

    const query = {
      endUserId: endUser.id,
      ...{
        workflowDefinitionId: workflowRuntimeDefinitionId,
        businessId: endUser.businesses.at(-1)!.id,
      },
    };

    this.logger.log(`Getting last active workflow`, query);

    const workflowData = await this.collectionFlowRepository.findLastActive(query);

    this.logger.log('Last active workflow', { workflowId: workflowData!.id });

    return workflowData;
  }
}
