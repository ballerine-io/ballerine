import { UIPage } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { describe, vi } from 'vitest';
import { generateFieldsForRevision } from './generate-fields-for-revision';
import { CollectionFlowStepStatesEnum } from '@ballerine/common';
import { IDocument } from '@ballerine/ui';

// Mock dependencies

describe('generateFieldsForRevision', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return undefined when no revision fields are found', () => {
    // Arrange
    const mockPages = [
      {
        stateName: 'page1',
        elements: [{ id: 'element1', valueDestination: 'value1' }],
      },
    ] as Array<UIPage<'v2'>>;

    const mockContext = {
      collectionFlow: {
        state: {
          steps: [{ stepName: 'page1', state: CollectionFlowStepStatesEnum.completed }],
        },
      },
    } as unknown as CollectionFlowContext;

    // Act
    const result = generateFieldsForRevision(mockPages, mockContext, []);

    // Assert
    expect(result).toBeUndefined();
  });

  it('should return all page fields as revision fields', () => {
    // Arrange
    const mockPages = [
      {
        stateName: 'page1',
        elements: [
          { id: 'element1', valueDestination: 'value1' },
          { id: 'element2', valueDestination: 'value2' },
        ],
      },
    ] as Array<UIPage<'v2'>>;

    const mockContext = {
      collectionFlow: {
        state: {
          steps: [{ stepName: 'page1', state: CollectionFlowStepStatesEnum.revision }],
        },
      },
    } as unknown as CollectionFlowContext;

    // Act
    const result = generateFieldsForRevision(mockPages, mockContext, []);

    // Assert
    expect(result).toEqual([
      { id: 'element1-*', reason: '' },
      { id: 'element2-*', reason: '' },
    ]);
  });

  it('should return only documents that are in revision', () => {
    // Arrange
    const context = {
      collectionFlow: {
        state: {
          steps: [
            {
              stepName: 'page1',
              state: CollectionFlowStepStatesEnum.revision,
            },
            {
              stepName: 'page2',
              state: CollectionFlowStepStatesEnum.completed,
            },
          ],
        },
      },
    };

    const pagesWithDocumentsInRevision = [
      {
        stateName: 'page1',
        elements: [
          {
            id: 'document1',
            element: 'documentfield',
            valueDestination: 'documents',
            params: { template: { type: 'document1', category: 'document1' } },
          },
          {
            id: 'document2',
            element: 'documentfield',
            valueDestination: 'documents',
            params: { template: { type: 'document2', category: 'document2' } },
          },
        ],
      },
      {
        stateName: 'page2',
        elements: [
          {
            id: 'document3',
            element: 'documentfield',
            valueDestination: 'documents',
            params: { template: { type: 'document3', category: 'document3' } },
          },
          {
            id: 'document4',
            element: 'documentfield',
            valueDestination: 'documents',
            params: { template: { type: 'document4', category: 'document4' } },
          },
        ],
      },
    ] as Array<UIPage<'v2'>>;

    // Act
    const result = generateFieldsForRevision(
      pagesWithDocumentsInRevision,
      context as unknown as CollectionFlowContext,
      [
        {
          id: 'document1',
          decision: 'revisions',
          decisionReason: 'needs_review',
          comment: 'please fix this',
          type: 'document1',
          category: 'document1',
        } as IDocument,
        {
          id: 'document2',
          decision: 'revisions',
          type: 'document2',
          category: 'document2',
        } as IDocument,
        {
          id: 'random-document',
        } as IDocument,
      ] as IDocument[],
    );

    // Assert
    expect(result).toEqual([
      { id: 'document1', reason: 'needs_review - please fix this' },
      { id: 'document2', reason: '' },
    ]);
  });

  it('should return requested documents', () => {
    // Arrange
    const mockContext = {
      collectionFlow: {
        state: {
          steps: [{ stepName: 'page1', state: CollectionFlowStepStatesEnum.revision }],
        },
      },
    } as unknown as CollectionFlowContext;

    const pagesWithRequestedDocuments = [
      {
        stateName: 'page1',
        elements: [
          {
            id: 'document1',
            element: 'documentfield',
            valueDestination: 'documents',
            params: { template: { type: 'document1', category: 'document1' } },
          },
          {
            id: 'document2',
            element: 'documentfield',
            valueDestination: 'documents',
            params: { template: { type: 'document2', category: 'document2' } },
          },
        ],
      },
      {
        stateName: 'page2',
        elements: [
          {
            id: 'document3',
            element: 'documentfield',
            valueDestination: 'documents',
            params: { template: { id: 'document3' } },
          },
          {
            id: 'document4',
            element: 'documentfield',
            valueDestination: 'documents',
            params: { template: { id: 'document4' } },
          },
        ],
      },
    ] as Array<UIPage<'v2'>>;

    // Act
    const result = generateFieldsForRevision(
      pagesWithRequestedDocuments,
      mockContext as unknown as CollectionFlowContext,
      [
        {
          id: 'document1',
          status: 'requested',
          type: 'document1',
          category: 'document1',
        } as IDocument,
        {
          id: 'document2',
          status: 'requested',
          type: 'document2',
          category: 'document2',
        } as IDocument,
        {
          id: 'random-document',
        } as IDocument,
      ],
    );

    // Assert
    expect(result).toEqual([
      { id: 'document1', reason: '' },
      { id: 'document2', reason: '' },
    ]);
  });

  it('should return documents with revision reason and comment', () => {
    // Arrange
    const mockContext = {
      collectionFlow: {
        state: {
          steps: [{ stepName: 'page1', state: CollectionFlowStepStatesEnum.revision }],
        },
      },
    } as unknown as CollectionFlowContext;

    const pagesWithDocumentsInRevision = [
      {
        stateName: 'page1',
        elements: [
          {
            id: 'document1',
            element: 'documentfield',
            valueDestination: 'documents',
            params: {
              template: {
                id: 'document1',
                type: 'document1',
                category: 'document1',
              },
            },
          },
        ],
      },
    ] as Array<UIPage<'v2'>>;

    // Act
    const result = generateFieldsForRevision(
      pagesWithDocumentsInRevision,
      mockContext as unknown as CollectionFlowContext,
      [
        {
          id: 'document1',
          decision: 'revisions',
          decisionReason: 'reason1',
          comment: 'comment1',
          type: 'document1',
          category: 'document1',
        } as IDocument,
        {
          id: 'random-document',
        } as IDocument,
      ],
    );

    // Assert
    expect(result).toEqual([{ id: 'document1', reason: 'reason1 - comment1' }]);
  });
});
