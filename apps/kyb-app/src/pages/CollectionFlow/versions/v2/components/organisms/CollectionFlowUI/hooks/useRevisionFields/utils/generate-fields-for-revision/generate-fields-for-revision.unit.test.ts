import { UIPage } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { describe, vi } from 'vitest';
import { generateFieldsForRevision } from './generate-fields-for-revision';
import { checkIfStepInRevision } from '../../../../helpers/check-if-step-in-revision';

// Mock dependencies
vi.mock('../../../../helpers/check-if-step-in-revision');

describe('generateFieldsForRevision', () => {
  // Arrange
  const mockPages = [
    {
      stateName: 'page1',
      elements: [{ id: 'element1', valueDestination: 'value1' }],
    },
    {
      stateName: 'page2',
      elements: [{ id: 'element2', valueDestination: 'value2' }],
    },
  ] as Array<UIPage<'v2'>>;

  const mockContext = {
    value1: 'value1',
    value2: 'value2',
    documents: [
      {
        id: 'element1',
      },
      {
        id: 'element2',
      },
    ],
  } as unknown as CollectionFlowContext;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return undefined when no revision fields are found', () => {
    // Act
    const result = generateFieldsForRevision(mockPages, mockContext);

    // Assert
    expect(result).toBeUndefined();
  });

  it('should return all page fields as revision fields', () => {
    // Arrange
    vi.mocked(checkIfStepInRevision).mockReturnValue(true);

    // Act
    const result = generateFieldsForRevision(mockPages, mockContext);

    // Assert
    expect(result).toEqual([
      { id: 'element1', reason: '' },
      { id: 'element2', reason: '' },
    ]);
  });

  it('should return only documents that are in revision', () => {
    // Arrange
    vi.mocked(checkIfStepInRevision).mockReturnValue(true);

    const contextWithDocumentsInRevision = {
      ...mockContext,
      documents: [
        { id: 'element1', _document: { decision: 'revisions' } },
        { id: 'element2', _document: { decision: 'revisions' } },
      ],
    };

    const pagesWithDocumentsInRevision = [
      {
        stateName: 'page1',
        elements: [
          { id: 'document1', element: 'documentfield', valueDestination: 'documents' },
          { id: 'document2', element: 'documentfield', valueDestination: 'documents' },
        ],
      },
    ] as Array<UIPage<'v2'>>;

    // Act
    const result = generateFieldsForRevision(
      pagesWithDocumentsInRevision,
      contextWithDocumentsInRevision as unknown as CollectionFlowContext,
    );

    // Assert
    expect(result).toEqual([
      { id: 'document1', reason: '' },
      { id: 'document2', reason: '' },
    ]);
  });

  it('should return requested documents', () => {
    // Arrange
    vi.mocked(checkIfStepInRevision).mockReturnValue(true);

    const contextWithDocumentsInRevision = {
      ...mockContext,
      documents: [
        { id: 'element1', _document: { status: 'requested' } },
        { id: 'element2', _document: { status: 'requested' } },
      ],
    };

    const pagesWithDocumentsInRevision = [
      {
        stateName: 'page1',
        elements: [
          { id: 'document1', element: 'documentfield', valueDestination: 'documents' },
          { id: 'document2', element: 'documentfield', valueDestination: 'documents' },
        ],
      },
    ] as Array<UIPage<'v2'>>;

    // Act
    const result = generateFieldsForRevision(
      pagesWithDocumentsInRevision,
      contextWithDocumentsInRevision as unknown as CollectionFlowContext,
    );

    // Assert
    expect(result).toEqual([
      { id: 'document1', reason: '' },
      { id: 'document2', reason: '' },
    ]);
  });

  it('should return documents with revision reason and comment', () => {
    // Arrange
    vi.mocked(checkIfStepInRevision).mockReturnValue(true);

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
              },
            },
          },
        ],
      },
    ] as Array<UIPage<'v2'>>;

    const contextWithDocumentsInRevision = {
      ...mockContext,
      documents: [
        {
          id: 'document1',
          _document: { decision: 'revisions', decisionReason: 'reason1', comment: 'comment1' },
        },
      ],
    };

    // Act
    const result = generateFieldsForRevision(
      pagesWithDocumentsInRevision,
      contextWithDocumentsInRevision as unknown as CollectionFlowContext,
    );

    // Assert
    expect(result).toEqual([{ id: 'document1', reason: 'reason1 - comment1' }]);
  });
});
