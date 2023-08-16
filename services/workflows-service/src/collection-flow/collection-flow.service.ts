import { GetActiveFlowParams, SigninCredentials } from '@/collection-flow/types/params';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { EndUserService } from '@/end-user/end-user.service';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { Injectable } from '@nestjs/common';
import { Business, EndUser } from '@prisma/client';

@Injectable()
export class CollectionFlowService {
  constructor(
    protected readonly logger: AppLoggerService,
    protected readonly endUserService: EndUserService,
    protected readonly workflowRuntimeDataRepository: WorkflowRuntimeDataRepository,
  ) {}

  async authorize(credentials: SigninCredentials): Promise<EndUser> {
    const existingEndUser = await this.endUserService.getByEmail(credentials.email);

    if (!existingEndUser) {
      return this.initializeNewEndUser(credentials);
    }

    return existingEndUser;
  }

  private async initializeNewEndUser(credentials: SigninCredentials) {
    const endUser = await this.endUserService.createWithBusiness({
      firstName: '',
      lastName: '',
      email: credentials.email,
      companyName: '',
    });

    return endUser;
  }

  async getActiveFlow({ endUserId, workflowRuntimeDefinitionId }: GetActiveFlowParams) {
    const endUser = (await this.endUserService.getById(endUserId, {
      include: { businesses: true },
    })) as EndUser & { businesses: Business[] };

    if (!endUser || !endUser.businesses.length) return null;

    const query = {
      endUserId: endUser.id,
      ...{
        workflowDefinitionId: workflowRuntimeDefinitionId,
        businessId: endUser.businesses.at(-1)!.id,
      },
    };

    this.logger.log(`Getting last active workflow`, query);

    const workflowData = await this.workflowRuntimeDataRepository.findLastActive(query);

    this.logger.log('Last active workflow', { workflowId: workflowData ? workflowData.id : null });

    return workflowData ? workflowData : null;
  }
}
