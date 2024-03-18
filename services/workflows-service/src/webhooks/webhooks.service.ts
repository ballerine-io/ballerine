import { Injectable } from '@nestjs/common';
import { IndividualAmlWebhookInput } from '@/webhooks/dtos/individual-aml-webhook-input';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { CustomerService } from '@/customer/customer.service';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { WorkflowService } from '@/workflow/workflow.service';

@Injectable()
export class WebhooksService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly workflowService: WorkflowService,
    private readonly endUserRepository: EndUserRepository,
    private readonly workflowDefinitionService: WorkflowDefinitionService,
  ) {}

  async handleIndividualAmlHit({ entityId, data }: IndividualAmlWebhookInput) {
    const { projectId, ...rest } = await this.endUserRepository.findByIdUnscoped(entityId, {
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
      return;
    }

    const { id: workflowDefinitionId } = await this.workflowDefinitionService.getLatestVersion(
      config.ongoingWorkflowDefinitionId,
      [projectId],
    );

    await this.workflowService.createOrUpdateWorkflowRuntime({
      workflowDefinitionId,
      context: {
        aml: data,
        entity: {
          data: {
            ...rest,
            additionalInfo: rest.additionalInfo ?? {},
          },
          id: entityId,
          ballerineEntityId: entityId,
          type: 'individual',
        },
        documents: [],
      },
      projectIds: [projectId],
      currentProjectId: projectId,
    });
  }
}
