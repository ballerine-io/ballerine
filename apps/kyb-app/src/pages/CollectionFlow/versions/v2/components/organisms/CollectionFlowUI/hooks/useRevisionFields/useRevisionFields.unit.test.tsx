import { UIPage } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useRevisionFields } from './useRevisionFields';
import { generateFieldsForRevision } from './utils/generate-fields-for-revision';
import { QueryClient, QueryClientProvider, UseQueryResult } from '@tanstack/react-query';
import { useDocumentsQuery } from '@/hooks/useDocumentsQuery';
import { IDocument } from '@ballerine/ui';

// Mock dependencies
vi.mock('./utils/generate-fields-for-revision', () => ({
  generateFieldsForRevision: vi.fn(),
}));

vi.mock('@/hooks/useDocumentsQuery', () => ({
  useDocumentsQuery: vi.fn(),
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

  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(generateFieldsForRevision).mockReturnValue(mockRevisionFields);
  });

  it('should call generateFieldsForRevision with correct parameters', () => {
    // Arrange
    const documents = [{ id: 'doc1' }] as IDocument[];
    vi.mocked(useDocumentsQuery).mockReturnValue({
      data: documents,
      isLoading: false,
    } as unknown as UseQueryResult<IDocument[], unknown>);

    // Act
    renderHook(() => useRevisionFields(mockPages, mockContext), { wrapper });

    // Assert
    expect(generateFieldsForRevision).toHaveBeenCalledWith(mockPages, mockContext, documents);
    expect(generateFieldsForRevision).toHaveBeenCalledTimes(1);
  });
});
