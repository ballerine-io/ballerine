import { IUIDefinitionPage } from '@/common/ui-definition-parse-utils/types';
import { DocumentService } from '@/document/document.service';
import { NotFoundException } from '@/errors';
import { AnyRecord, PrismaTransactionClient, TProjectIds } from '@/types';
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
import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  Document,
  DocumentDecision,
  DocumentStatus,
  EndUserVariant,
  UiDefinition,
} from '@prisma/client';
import { findEntityFieldsDefinition } from '../helpers/find-entity-fields-definition';
import { findDocumentDefinitionByTypeAndCategory } from '../helpers/find-document-definition-by-type-and-category';
import { findBusinessDocumentDefinitionByTypeAndCategory } from '../helpers/find-business-document-definition';
import { EntityType, TEntityType } from '../enums';
import { CollectionFlowMissingException } from '../exceptions/collection-flow-missing.exception';
import { UpdateCollectionFlowStateDto } from '@/workflow/dtos/update-collection-flow-state.dto';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { Type } from '@sinclair/typebox';
import isEqual from 'lodash/isEqual';
import {
  beginTransactionIfNotExistCurry,
  defaultPrismaTransactionOptions,
} from '@/prisma/prisma.util';
import { PrismaService } from '@/prisma/prisma.service';
import { assertIsValidProjectIds } from '@/project/project-scope.service';
import { CollectionFlowUtilityService } from './сollection-flow-utility/collection-flow-utility.service';

@Injectable()
export class CollectionFlowStateService {
  constructor(
    protected readonly workflowRuntimeDataRepository: WorkflowRuntimeDataRepository,
    protected readonly uiDefinitionService: UiDefinitionService,
    protected readonly documentService: DocumentService,
    @Inject(forwardRef(() => WorkflowService))
    protected readonly workflowService: WorkflowService,
    protected readonly appLogger: AppLoggerService,
    protected readonly prismaService: PrismaService,
    protected readonly collectionFlowUtilityService: CollectionFlowUtilityService,
  ) {}

  async getCollectionFlowState(workflowId: string, projectIds: TProjectIds) {
    assertIsValidProjectIds(projectIds);

    const workflowWithRelations = await this.workflowService.getWorkflowByIdWithRelations(
      workflowId,
      projectIds,
    );

    const collectionFlowState = getCollectionFlowState(workflowWithRelations.context);
    const isCollectionFlowStateSupported =
      await this.collectionFlowUtilityService.isCollectionFlowStateSupported(
        workflowId,
        projectIds,
      );

    if (!isCollectionFlowStateSupported) {
      return null;
    }

    if (!collectionFlowState) {
      throw new CollectionFlowMissingException();
    }

    const uiDefinition = await this.uiDefinitionService.getByWorkflowDefinitionId(
      workflowWithRelations.workflowDefinitionId,
      'collection_flow',
      projectIds,
    );

    const entities = workflowWithRelations.endUsers || [];

    const documents = await this.documentService.getLatestDocumentsWithFilesByWorkflowId(
      workflowId,
      projectIds,
    );

    const computedCollectionFlowState = await this.computeCollectionFlowState(
      uiDefinition,
      workflowWithRelations.context,
      documents,
      [
        // For KYC-only workflows there is typically a single `endUserId` on the runtime data
        // and no `endUsers[]` relation (directors/ubos). Include it so document revisions don't
        // crash the collection-flow state computation.
        ...(workflowWithRelations.endUserId
          ? [{ entityId: workflowWithRelations.endUserId, variant: 'business' as const }]
          : []),
        ...entities.map(entity => ({
          entityId: entity.id,
          variant: (entity.variant || 'business') as EndUserVariant | 'business',
        })),
      ].filter(
        (value, index, array) => array.findIndex(v => v.entityId === value.entityId) === index,
      ),
    );

    const isCollectionFlowStateEqual = isEqual(collectionFlowState, computedCollectionFlowState);

    if (!isCollectionFlowStateEqual) {
      // Syncing the computed collection flow state with the workflow runtime data
      await this.workflowService.updateWorkflowRuntimeData(
        workflowId,
        {
          context: {
            ...workflowWithRelations.context,
            collectionFlow: {
              ...workflowWithRelations.context.collectionFlow,
              state: computedCollectionFlowState,
            },
          },
        },
        projectIds[0]!,
      );
    }

    return computedCollectionFlowState;
  }

  private async computeCollectionFlowState(
    uiDefinition: UiDefinition,
    _context: AnyRecord,
    documents: Document[],
    entities: Array<{ entityId: string; variant: EndUserVariant | 'business' }>,
  ) {
    const context = structuredClone(_context);
    let documentsWithEntityTypes = documents.map(document => ({
      ...document,
      entityType: document.businessId
        ? EntityType.business
        : entities.find(entity => entity.entityId === document.endUserId)?.variant,
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

    const firstNotCompletedStep = collectionFlowState.steps.find(
      (step: TCollectionFlowStep) => step.state !== CollectionFlowStepStatesEnum.completed,
    );

    if (firstNotCompletedStep) {
      return firstNotCompletedStep.stepName;
    }

    return collectionFlowState.steps?.at(-1)?.stepName;
  }

  computeCurrentStatus(collectionFlowState: TCollectionFlowState) {
    // Statuses that should not be dynamically computed from steps state
    if (
      [
        CollectionFlowStatusesEnum.failed,
        CollectionFlowStatusesEnum.rejected,
        CollectionFlowStatusesEnum.revision,
        CollectionFlowStatusesEnum.approved,
      ].includes(collectionFlowState.status)
    ) {
      return collectionFlowState.status;
    }

    if (
      collectionFlowState.steps?.some(
        (step: TCollectionFlowStep) => step.state === CollectionFlowStepStatesEnum.edit,
      )
    ) {
      return CollectionFlowStatusesEnum.edit;
    }

    // Computing revision status
    if (
      collectionFlowState.steps?.some(
        (step: TCollectionFlowStep) => step.state === CollectionFlowStepStatesEnum.revision,
      )
    ) {
      return CollectionFlowStatusesEnum.revision;
    }

    // Computing inProgress status
    if (
      collectionFlowState.steps?.some(
        (step: TCollectionFlowStep) => step.state === CollectionFlowStepStatesEnum.completed,
      ) &&
      !collectionFlowState.steps?.every(
        (step: TCollectionFlowStep) => step.state === CollectionFlowStepStatesEnum.completed,
      )
    ) {
      return CollectionFlowStatusesEnum.inprogress;
    }

    // Computing completed status
    if (
      collectionFlowState.steps?.every(
        (step: TCollectionFlowStep) => step.state === CollectionFlowStepStatesEnum.completed,
      )
    ) {
      return CollectionFlowStatusesEnum.completed;
    }

    return collectionFlowState.status;
  }

  async updateCollectionFlowState(
    workflowId: string,
    newState: UpdateCollectionFlowStateDto,
    projectIds: TProjectIds,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    const beginTransaction = beginTransactionIfNotExistCurry({
      prismaService: this.prismaService,
      options: defaultPrismaTransactionOptions,
      transaction,
    });

    return beginTransaction(async transaction => {
      const workflow = await this.workflowService.getWorkflowRuntimeDataById(
        workflowId,
        {
          select: {
            context: true,
            workflowDefinitionId: true,
          },
        },
        projectIds,
        transaction,
      );

      const uiDefinition = await this.uiDefinitionService.getByWorkflowDefinitionId(
        workflow.workflowDefinitionId,
        'collection_flow',
        projectIds,
      );

      if (!uiDefinition) {
        throw new NotFoundException('Collection flow UI definition not found.');
      }

      const collectionFlowState = getCollectionFlowState(workflow.context);

      if (!collectionFlowState) {
        throw new NotFoundException('Collection flow state not found.');
      }

      // Ensuring steps are valid and following structure of uiDefinition
      this.validateCollectionFlowSteps(newState, uiDefinition);

      // Ensuring current step is valid and exists in uiDefinition
      this.validateCollectionFlowCurrentStep(newState, uiDefinition);

      await this.workflowService.updateWorkflowRuntimeData(
        workflowId,
        {
          context: {
            ...workflow.context,
            collectionFlow: {
              ...workflow.context.collectionFlow,
              state: newState,
            },
          },
        },
        projectIds![0]!,
        transaction,
      );

      const resolvedState = await this.getCollectionFlowState(workflowId, projectIds);

      return resolvedState;
    });
  }

  private validateCollectionFlowSteps(
    newState: UpdateCollectionFlowStateDto,
    uiDefinition: UiDefinition,
  ) {
    const collectionFlowSteps = (
      uiDefinition.uiSchema as unknown as { elements: IUIDefinitionPage[] }
    ).elements;

    const uiDefinitionStepsSchema = Type.Tuple(
      collectionFlowSteps.map(step =>
        Type.Object({
          stepName: Type.Literal(step.stateName),
        }),
      ),
    );

    const StepsValidator = TypeCompiler.Compile(uiDefinitionStepsSchema);

    const isValid = StepsValidator.Check(newState.steps);

    if (!isValid) {
      const errors = Array.from(StepsValidator.Errors(newState.steps));
      this.appLogger.error('Invalid collection flow steps.', {
        newState,
        errors,
      });
      throw new BadRequestException({
        message: 'Invalid collection flow steps.',
        errors,
      });
    }
  }

  private validateCollectionFlowCurrentStep(
    newState: UpdateCollectionFlowStateDto,
    uiDefinition: UiDefinition,
  ) {
    const collectionFlowSteps = (
      uiDefinition.uiSchema as unknown as { elements: IUIDefinitionPage[] }
    ).elements;

    const currentStep = collectionFlowSteps.find(s => s.stateName === newState.currentStep);

    if (!currentStep) {
      throw new BadRequestException(
        `Current step ${newState.currentStep} not exists in the collection flow.`,
      );
    }
  }
}
