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

  async handleAmlHit({ entityId }: IndividualAmlWebhookInput) {
    const { projectId } = await this.endUserRepository.findByIdUnscoped(entityId, {
      select: {
        projectId: true,
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
        entity: {
          id: entityId,
          type: 'individual',
        },
        documents: [],
      },
      projectIds: [projectId],
      currentProjectId: projectId,
    });
  }
}
