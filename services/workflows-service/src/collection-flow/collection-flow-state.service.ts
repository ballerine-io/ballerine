import { IUIDefinitionPage } from '@/common/ui-definition-parse-utils/types';
import { DocumentService } from '@/document/document.service';
import { NotFoundException } from '@/errors';
import { AnyRecord, TProjectIds } from '@/types';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { WorkflowService } from '@/workflow/workflow.service';
import {
  CollectionFlowStatusesEnum,
  CollectionFlowStepStatesEnum,
  getCollectionFlowState,
  TCollectionFlowState,
  TCollectionFlowStep,
  updateCollectionFlowStep,
} from '@ballerine/common';
import { Injectable } from '@nestjs/common';
import {
  Document,
  DocumentDecision,
  DocumentStatus,
  UiDefinition,
  WorkflowRuntimeData,
} from '@prisma/client';
import { findEntityFieldsDefinition } from './helpers/find-entity-fields-definition';
import { findDocumentDefinitionByTypeAndCategory } from './helpers/find-document-definition-by-type-and-category';
import { findBusinessDocumentDefinitionByTypeAndCategory } from './helpers/find-business-document-definition';
import { EntityType, TEntityType } from './enums';

@Injectable()
export class CollectionFlowStateService {
  constructor(
    protected readonly workflowRuntimeDataRepository: WorkflowRuntimeDataRepository,
    protected readonly uiDefinitionService: UiDefinitionService,
    protected readonly documentService: DocumentService,
    protected readonly workflowService: WorkflowService,
  ) {}

  async getCollectionFlowState(workflowId: string, projectIds: TProjectIds) {
    const workflowRuntimeData = (await this.workflowService.getWorkflowRuntimeDataById(
      workflowId,
      {
        select: {
          workflowDefinitionId: true,
          context: true,
          childWorkflowsRuntimeData: true,
        },
      },
      projectIds,
    )) as WorkflowRuntimeData & {
      childWorkflowsRuntimeData: WorkflowRuntimeData[];
    };

    const uiDefinition = await this.uiDefinitionService.getByWorkflowDefinitionId(
      workflowRuntimeData.workflowDefinitionId,
      'collection_flow',
      projectIds,
    );

    const entities = this.getEntityIdsFromWorkflow(workflowRuntimeData);

    const documents = (await this.documentService.getByEntityIdsAndWorkflowId(
      entities.map(entity => entity.entityId),
      workflowId,
      projectIds!,
    )) as Document[];

    const collectionFlowState = getCollectionFlowState(workflowRuntimeData.context);

    if (!collectionFlowState) {
      throw new NotFoundException('Collection flow state not found');
    }

    return this.computeCollectionFlowState(
      uiDefinition,
      workflowRuntimeData.context,
      documents,
      entities,
    );
  }

  private async computeCollectionFlowState(
    uiDefinition: UiDefinition,
    _context: AnyRecord,
    documents: Document[],
    entities: Array<{ entityId: string; entityType: TEntityType }>,
  ) {
    const context = structuredClone(_context);
    let documentsWithEntityTypes = documents.map(document => ({
      ...document,
      entityType:
        entities.find(entity => entity.entityId === document.endUserId)?.entityType ||
        entities.find(entity => entity.entityId === document.businessId)?.entityType,
    })) as Array<Document & { entityType: TEntityType }>;

    if (!getCollectionFlowState(context)) {
      throw new NotFoundException('Collection flow state not found');
    }

    documentsWithEntityTypes = documentsWithEntityTypes.filter(
      document =>
        document.status === DocumentStatus.requested ||
        document.decision === DocumentDecision.revisions,
    );

    const collectionFlowSteps = (
      uiDefinition.uiSchema as unknown as { elements: IUIDefinitionPage[] }
    ).elements;

    collectionFlowSteps.forEach(step => {
      documentsWithEntityTypes.forEach(document => {
        if (document.entityType === EntityType.business) {
          const businessDocumentDefinition = findBusinessDocumentDefinitionByTypeAndCategory(
            step.elements,
            {
              type: document.type,
              category: document.category,
            },
          );

          if (businessDocumentDefinition) {
            updateCollectionFlowStep(context, step.stateName, {
              state: CollectionFlowStepStatesEnum.revision,
            });
          }

          return;
        }

        if ([EntityType.director, EntityType.ubo].includes(document.entityType)) {
          const entityFieldsDefinition = findEntityFieldsDefinition(
            step.elements,
            document.entityType,
          );

          if (
            entityFieldsDefinition &&
            findDocumentDefinitionByTypeAndCategory(entityFieldsDefinition.children || [], {
              type: document.type,
              category: document.category,
            })
          ) {
            updateCollectionFlowStep(context, step.stateName, {
              state: CollectionFlowStepStatesEnum.revision,
            });
          }

          return;
        }

        throw new Error(`Unknown entity type: ${document.entityType}`);
      });
    });

    const currentStep = this.computeCurrentStep(getCollectionFlowState(context));
    const currentStatus = this.computeCurrentStatus(getCollectionFlowState(context));

    context.collectionFlow.state.currentStep = currentStep;
    context.collectionFlow.state.status = currentStatus;

    return getCollectionFlowState(context);
  }

  private computeCurrentStep(collectionFlowState: TCollectionFlowState) {
    const isRevision = collectionFlowState.status === CollectionFlowStatusesEnum.revision;
    const isEdit = collectionFlowState.status === CollectionFlowStatusesEnum.edit;

    if (isRevision) {
      const revisionStep = collectionFlowState.steps.find(
        (step: TCollectionFlowStep) => step.state === CollectionFlowStepStatesEnum.revision,
      );

      if (revisionStep) {
        return revisionStep.stepName;
      }
    }

    if (isEdit) {
      const editStep = collectionFlowState.steps.find(
        (step: TCollectionFlowStep) => step.state === CollectionFlowStepStatesEnum.edit,
      );

      if (editStep) {
        return editStep.stepName;
      }
    }

    return collectionFlowState.steps.find(
      (step: TCollectionFlowStep) => step.state !== CollectionFlowStepStatesEnum.completed,
    )?.stepName;
  }

  private computeCurrentStatus(collectionFlowState: TCollectionFlowState) {
    if (collectionFlowState.status === CollectionFlowStatusesEnum.failed) {
      return CollectionFlowStatusesEnum.failed;
    }

    if (collectionFlowState.status === CollectionFlowStatusesEnum.edit) {
      return CollectionFlowStatusesEnum.edit;
    }

    if (
      collectionFlowState.steps?.some(
        (step: TCollectionFlowStep) => step.state === CollectionFlowStepStatesEnum.revision,
      )
    ) {
      return CollectionFlowStatusesEnum.revision;
    }

    if (
      collectionFlowState.steps?.every(
        (step: TCollectionFlowStep) => step.state === CollectionFlowStepStatesEnum.completed,
      )
    ) {
      return CollectionFlowStatusesEnum.completed;
    }

    return collectionFlowState.status;
  }

  private getEntityIdsFromWorkflow(
    workflow: WorkflowRuntimeData & {
      childWorkflowsRuntimeData: WorkflowRuntimeData[];
    },
  ): Array<{ entityId: string; entityType: TEntityType }> {
    const entityIds: Array<{ entityId: string; entityType: TEntityType }> = [
      {
        entityId: workflow.context.entity.ballerineEntityId,
        entityType: EntityType.business,
      },
    ];

    workflow.childWorkflowsRuntimeData?.forEach(childWorkflow => {
      if (!childWorkflow.endUserId) {
        throw new Error('End user ID not found on child workflow.');
      }

      entityIds.push({
        entityId: childWorkflow.endUserId,
        entityType: EntityType.ubo,
      });
    });

    workflow.context?.entity?.data?.additionalInfo?.directors?.forEach(
      (director: { ballerineEntityId: string }) => {
        entityIds.push({
          entityId: director.ballerineEntityId,
          entityType: EntityType.director,
        });
      },
    );

    return entityIds;
  }
}
