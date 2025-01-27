import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { IFormElement } from '@ballerine/ui';
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { usePriorityFields } from './usePriorityFields';
import { generatePriorityFields } from './utils/generate-priority-fields';

vi.mock('./utils/generate-priority-fields');

describe('usePriorityFields', () => {
  const mockElements = [
    {
      id: 'test-element',
      element: 'test',
    },
  ] as Array<IFormElement<any, any>>;

  const mockContext = {
    documents: [],
  } as unknown as CollectionFlowContext;

  const mockPriorityFields = [
    {
      id: 'test-id',
      reason: 'test-reason',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call generatePriorityFields with correct arguments', () => {
    const mockedGeneratePriorityFields = vi.mocked(generatePriorityFields);
    mockedGeneratePriorityFields.mockReturnValue(mockPriorityFields);

    renderHook(() => usePriorityFields(mockElements, mockContext));

    expect(generatePriorityFields).toHaveBeenCalledWith(mockElements, mockContext);
    expect(generatePriorityFields).toHaveBeenCalledTimes(1);
  });

  it('should return priority fields from generatePriorityFields', () => {
    const mockedGeneratePriorityFields = vi.mocked(generatePriorityFields);
    mockedGeneratePriorityFields.mockReturnValue(mockPriorityFields);

    const { result } = renderHook(() => usePriorityFields(mockElements, mockContext));

    expect(result.current).toBe(mockPriorityFields);
  });

  it('should memoize the result and not call generatePriorityFields again if inputs have not changed', () => {
    const mockedGeneratePriorityFields = vi.mocked(generatePriorityFields);
    mockedGeneratePriorityFields.mockReturnValue(mockPriorityFields);

    const { rerender } = renderHook(() => usePriorityFields(mockElements, mockContext));

    rerender();

    expect(generatePriorityFields).toHaveBeenCalledTimes(1);
  });

  it('should call generatePriorityFields again if elements change', () => {
    const mockedGeneratePriorityFields = vi.mocked(generatePriorityFields);
    mockedGeneratePriorityFields.mockReturnValue(mockPriorityFields);

    const { rerender } = renderHook(
      ({ elements, context }) => usePriorityFields(elements, context),
      {
        initialProps: {
          elements: mockElements,
          context: mockContext,
        },
      },
    );

    const newElements = [
      {
        id: 'new-element',
        element: 'test',
      },
    ] as Array<IFormElement<any, any>>;

    rerender({ elements: newElements, context: mockContext });

    expect(generatePriorityFields).toHaveBeenCalledTimes(2);
  });

  it('should call generatePriorityFields again if context changes', () => {
    const mockedGeneratePriorityFields = vi.mocked(generatePriorityFields);
    mockedGeneratePriorityFields.mockReturnValue(mockPriorityFields);

    const { rerender } = renderHook(
      ({ elements, context }) => usePriorityFields(elements, context),
      {
        initialProps: {
          elements: mockElements,
          context: mockContext,
        },
      },
    );

    const newContext = {
      documents: [{ id: 'test' }],
    } as CollectionFlowContext;

    rerender({ elements: mockElements, context: newContext });

    expect(generatePriorityFields).toHaveBeenCalledTimes(2);
  });
});
