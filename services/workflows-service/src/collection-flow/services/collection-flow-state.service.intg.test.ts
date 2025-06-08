import { CollectionFlowStateService } from './collection-flow-state.service';
import { noop } from 'lodash';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { DocumentService } from '@/document/document.service';
import { WorkflowService } from '@/workflow/workflow.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CollectionFlowStatusesEnum,
  CollectionFlowStepStatesEnum,
  TCollectionFlowState,
} from '@ballerine/common';
import { PrismaService } from '@/prisma/prisma.service';

const deps: Provider[] = [
  {
    provide: WorkflowRuntimeDataRepository,
    useValue: noop,
  },
  {
    provide: UiDefinitionService,
    useValue: noop,
  },
  {
    provide: DocumentService,
    useValue: noop,
  },
  {
    provide: WorkflowService,
    useValue: noop,
  },
  {
    provide: AppLoggerService,
    useValue: noop,
  },
];

describe('CollectionFlowStateService', () => {
  let collectionFlowStateService: CollectionFlowStateService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...deps, PrismaService, CollectionFlowStateService],
      imports: [],
    }).compile();

    collectionFlowStateService = module.get<CollectionFlowStateService>(CollectionFlowStateService);
  });

  describe('computeCurrentStatus', () => {
    test.each([
      [{ status: CollectionFlowStatusesEnum.failed }, CollectionFlowStatusesEnum.failed],
      [{ status: CollectionFlowStatusesEnum.rejected }, CollectionFlowStatusesEnum.rejected],
      [{ status: CollectionFlowStatusesEnum.approved }, CollectionFlowStatusesEnum.approved],
    ])('should return immutable %s status', (collectionFlowState, expectedStatus) => {
      // Arrange: Set up the collection flow state with a specific status
      const state = collectionFlowState as TCollectionFlowState;

      // Act: Call the method to compute the current status
      const result = collectionFlowStateService.computeCurrentStatus(state);

      // Assert: Verify that the status remains unchanged for immutable statuses
      expect(result).toBe(expectedStatus);
    });

    it('should return inprogress status', () => {
      // Arrange: Set up the collection flow state for inprogress status
      const collectionFlowState = {
        steps: [
          { state: CollectionFlowStepStatesEnum.completed },
          { state: CollectionFlowStepStatesEnum.inProgress },
        ],
      };

      // Act: Call the method to compute the current status
      expect(collectionFlowStateService.computeCurrentStatus(collectionFlowState)).toBe(
        CollectionFlowStatusesEnum.inprogress,
      );
    });

    it('should return edit status', () => {
      // Arrange: Set up the collection flow state for edit status
      const collectionFlowState = {
        steps: [
          { state: CollectionFlowStepStatesEnum.completed },
          { state: CollectionFlowStepStatesEnum.revision },
          { state: CollectionFlowStepStatesEnum.edit },
        ],
      };

      // Act: Call the method to compute the current status
      expect(collectionFlowStateService.computeCurrentStatus(collectionFlowState)).toBe(
        CollectionFlowStatusesEnum.edit,
      );
    });

    it('should return revision status', () => {
      // Arrange: Set up the collection flow state for revision status
      const collectionFlowState = {
        steps: [
          { state: CollectionFlowStepStatesEnum.completed },
          { state: CollectionFlowStepStatesEnum.completed },
          { state: CollectionFlowStepStatesEnum.revision },
        ],
      };

      // Act: Call the method to compute the current status
      expect(collectionFlowStateService.computeCurrentStatus(collectionFlowState)).toBe(
        CollectionFlowStatusesEnum.revision,
      );
    });

    it('should return inprogress status', () => {
      // Arrange: Set up the collection flow state for inprogress status
      const collectionFlowState = {
        steps: [
          { state: CollectionFlowStepStatesEnum.completed },
          { state: CollectionFlowStepStatesEnum.completed },
          { state: CollectionFlowStepStatesEnum.completed },
          { state: CollectionFlowStepStatesEnum.idle },
        ],
      };

      // Act: Call the method to compute the current status
      expect(collectionFlowStateService.computeCurrentStatus(collectionFlowState)).toBe(
        CollectionFlowStatusesEnum.inprogress,
      );
    });

    it('should return completed status', () => {
      // Arrange: Set up the collection flow state for completed status
      const collectionFlowState = {
        steps: [
          { state: CollectionFlowStepStatesEnum.completed },
          { state: CollectionFlowStepStatesEnum.completed },
          { state: CollectionFlowStepStatesEnum.completed },
          { state: CollectionFlowStepStatesEnum.completed },
        ],
      };

      // Act: Call the method to compute the current status
      expect(collectionFlowStateService.computeCurrentStatus(collectionFlowState)).toBe(
        CollectionFlowStatusesEnum.completed,
      );
    });
  });
});
