import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDynamicForm } from '../../../context';
import { useStack } from '../../../fields';
import { useField } from '../../external';
import { useClear } from './useClear';
import {
  DOCUMENT_FIELD_VALUE_CLEANER,
  documentFieldValueCleaner,
} from './value-cleaners/documentfield-value-cleaner';

vi.mock('../../../fields', () => ({
  useStack: vi.fn(),
}));

vi.mock('../../external', () => ({
  useField: vi.fn(),
}));

vi.mock('../../../context', () => ({
  useDynamicForm: vi.fn(),
}));

vi.mock('./value-cleaners/documentfield-value-cleaner', () => ({
  documentFieldValueCleaner: vi.fn(),
  DOCUMENT_FIELD_VALUE_CLEANER: 'documentfield',
}));

describe('useClear', () => {
  const mockStack = { stack: [] };
  const mockOnChange = vi.fn();
  const mockMetadata = { someMetadata: 'test' };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useStack).mockReturnValue(mockStack);
    vi.mocked(useField).mockReturnValue({ onChange: mockOnChange, value: 'test' } as any);
    vi.mocked(useDynamicForm).mockReturnValue({ metadata: mockMetadata } as any);
  });

  it('should return a function that calls onChange with undefined for unknown element types', async () => {
    const element = {
      id: 'test',
      valueDestination: 'test',
      element: 'unknown-type',
    };

    const { result } = renderHook(() => useClear(element));
    await result.current('some-value');

    expect(mockOnChange).toHaveBeenCalledWith(undefined, true);
  });

  it('should use documentFieldValueCleaner for document field type', async () => {
    const element = {
      id: 'test',
      valueDestination: 'test',
      element: DOCUMENT_FIELD_VALUE_CLEANER,
    };
    const mockValue = [{ id: '1' }];
    const mockCleanedValue = Promise.resolve([{ id: '2' }]);

    vi.mocked(documentFieldValueCleaner).mockReturnValue(mockCleanedValue);

    const { result } = renderHook(() => useClear(element));
    await result.current(mockValue);

    expect(documentFieldValueCleaner).toHaveBeenCalledWith(mockValue, element, mockMetadata);
    expect(mockOnChange).toHaveBeenCalledWith(await mockCleanedValue, true);
  });

  it('should memoize the clean function', () => {
    const element = {
      id: 'test',
      valueDestination: 'test',
      element: 'unknown-type',
    };

    const { result, rerender } = renderHook(() => useClear(element));
    const firstResult = result.current;

    rerender();

    expect(result.current).toBe(firstResult);
  });

  it('should update metadataRef when metadata changes', () => {
    const element = {
      id: 'test',
      valueDestination: 'test',
      element: DOCUMENT_FIELD_VALUE_CLEANER,
    };

    const { rerender } = renderHook(() => useClear(element));

    const newMetadata = { someMetadata: 'updated' };
    vi.mocked(useDynamicForm).mockReturnValue({ metadata: newMetadata } as any);

    rerender();

    expect(vi.mocked(useDynamicForm)).toHaveBeenCalledTimes(2);
  });
});
