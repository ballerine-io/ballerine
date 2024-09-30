import { Injectable } from '@nestjs/common';
import { IndividualAmlWebhookInput } from '@/webhooks/dtos/individual-aml-webhook-input';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { CustomerService } from '@/customer/customer.service';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { WorkflowService } from '@/workflow/workflow.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { EndUserService } from '@/end-user/end-user.service';

@Injectable()
export class WebhooksService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly workflowService: WorkflowService,
    private readonly endUserRepository: EndUserRepository,
    private readonly workflowDefinitionService: WorkflowDefinitionService,
    private readonly logger: AppLoggerService,
    private readonly endUserService: EndUserService,
  ) {}

  async handleIndividualAmlHit({
    endUserId,
    data,
  }: {
    endUserId: string;
    data: IndividualAmlWebhookInput['data'];
  }) {
    this.logger.log('Started handling individual AML hit', { endUserId });

    const { projectId, ...rest } = await this.endUserRepository.findByIdUnscoped(endUserId, {
      select: {
        approvalState: true,
        stateReason: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        country: true,
        nationalId: true,
        dateOfBirth: true,
        additionalInfo: true,
        createdAt: true,
        updatedAt: true,
        projectId: true,
        businesses: {
          select: {
            address: true,
            country: true,
            website: true,
            companyName: true,
            businessType: true,
            approvalState: true,
            registrationNumber: true,
            dateOfIncorporation: true,
            countryOfIncorporation: true,
          },
        },
      },
    });

    const { config } = await this.customerService.getByProjectId(projectId, {
      select: { config: true },
    });

    if (!config?.ongoingWorkflowDefinitionId) {
      this.logger.error('No ongoing workflow definition found for project', { projectId });

      return;
    }

    const { id: workflowDefinitionId } = await this.workflowDefinitionService.getLatestVersion(
      config.ongoingWorkflowDefinitionId,
      [projectId],
    );

    const hits = data?.hits ?? [];

    const amlHits = hits.map(hit => ({
      ...hit,
      vendor: 'veriff',
    }));

    await this.endUserService.updateById(endUserId, {
      data: {
        amlHits,
      },
    });

    if (hits.length === 0) {
      this.logger.log('No AML hits found', { endUserId });

      return;
    }

    const workflow = await this.workflowService.createOrUpdateWorkflowRuntime({
      workflowDefinitionId,
      context: {
        aml: data,
        entity: {
          // @ts-expect-error -- prisma date not compatible with typebox
          data: {
            ...rest,
            additionalInfo: rest.additionalInfo ?? {},
          },
          ballerineEntityId: endUserId,
          type: 'individual',
        },
        documents: [],
      },
      projectIds: [projectId],
      currentProjectId: projectId,
    });

    this.logger.log(`Created workflow for AML hits`, { workflow });
  }
}
