import { UIPage } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useRevisionFields } from './useRevisionFields';
import { generateFieldsForRevision } from './utils/generate-fields-for-revision';

// Mock dependencies
vi.mock('./utils/generate-fields-for-revision', () => ({
  generateFieldsForRevision: vi.fn(),
}));

describe('useRevisionFields', () => {
  // Arrange
  const mockPages = [
    {
      stateName: 'page1',
      elements: [{ id: 'element1' }],
    },
    {
      stateName: 'page2',
      elements: [{ id: 'element2' }],
    },
  ] as Array<UIPage<'v2'>>;

  const mockContext = {
    documents: [],
  } as unknown as CollectionFlowContext;

  const mockRevisionFields = [
    { id: 'field1', reason: '' },
    { id: 'field2', reason: 'some reason' },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(generateFieldsForRevision).mockReturnValue(mockRevisionFields);
  });

  it('should call generateFieldsForRevision with correct parameters', () => {
    // Act
    renderHook(() => useRevisionFields(mockPages, mockContext));

    // Assert
    expect(generateFieldsForRevision).toHaveBeenCalledWith(mockPages, mockContext);
    expect(generateFieldsForRevision).toHaveBeenCalledTimes(1);
  });

  it('should return the result from generateFieldsForRevision', () => {
    // Act
    const { result } = renderHook(() => useRevisionFields(mockPages, mockContext));

    // Assert
    expect(result.current).toEqual(mockRevisionFields);
  });

  it('should memoize the result and not recalculate when dependencies do not change', () => {
    // Act
    const { rerender } = renderHook(() => useRevisionFields(mockPages, mockContext));
    rerender();

    // Assert
    expect(generateFieldsForRevision).toHaveBeenCalledTimes(1);
  });

  it('should recalculate when pages change', () => {
    // Arrange
    const newMockPages = [
      {
        stateName: 'page3',
        elements: [{ id: 'element3' }],
      },
    ] as Array<UIPage<'v2'>>;

    // Act
    const { rerender } = renderHook(({ pages, context }) => useRevisionFields(pages, context), {
      initialProps: { pages: mockPages, context: mockContext },
    });

    rerender({ pages: newMockPages, context: mockContext });

    // Assert
    expect(generateFieldsForRevision).toHaveBeenCalledTimes(2);
    expect(generateFieldsForRevision).toHaveBeenLastCalledWith(newMockPages, mockContext);
  });

  it('should recalculate when context changes', () => {
    // Arrange
    const newMockContext = {
      documents: [{ id: 'doc1' }],
    } as unknown as CollectionFlowContext;

    // Act
    const { rerender } = renderHook(({ pages, context }) => useRevisionFields(pages, context), {
      initialProps: { pages: mockPages, context: mockContext },
    });

    rerender({ pages: mockPages, context: newMockContext });

    // Assert
    expect(generateFieldsForRevision).toHaveBeenCalledTimes(2);
    expect(generateFieldsForRevision).toHaveBeenLastCalledWith(mockPages, newMockContext);
  });
});
