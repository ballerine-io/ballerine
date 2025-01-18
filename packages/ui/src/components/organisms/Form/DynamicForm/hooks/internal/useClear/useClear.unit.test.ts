import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useStack } from '../../../fields';
import { useField } from '../../external';
import { useClear } from './useClear';
import { documentFieldValueCleaner } from './value-cleaners/documentfield-value-cleaner';

vi.mock('../../../fields', () => ({
  useStack: vi.fn(),
}));

vi.mock('../../external', () => ({
  useField: vi.fn(),
}));

vi.mock('./value-cleaners/documentfield-value-cleaner', () => ({
  documentFieldValueCleaner: vi.fn(),
  DOCUMENT_FIELD_VALUE_CLEANER: 'document',
}));

describe('useClear', () => {
  const mockStack = { stack: [] };
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useStack).mockReturnValue(mockStack);
    vi.mocked(useField).mockReturnValue({ onChange: mockOnChange, value: 'test' } as any);
  });

  it('should return a function that calls onChange with undefined for unknown element types', () => {
    const element = {
      id: 'test',
      valueDestination: 'test',
      element: 'unknown-type',
    };

    const { result } = renderHook(() => useClear(element));
    result.current('some-value');

    expect(mockOnChange).toHaveBeenCalledWith(undefined, true);
  });

  it('should use documentFieldValueCleaner for document field type', () => {
    const element = {
      id: 'test',
      valueDestination: 'test',
      element: 'document',
    };
    const mockValue = [{ id: '1' }];
    const mockCleanedValue = [{ id: '2' }];

    vi.mocked(documentFieldValueCleaner).mockReturnValue(mockCleanedValue);

    const { result } = renderHook(() => useClear(element));
    result.current(mockValue);

    expect(documentFieldValueCleaner).toHaveBeenCalledWith(mockValue, element);
    expect(mockOnChange).toHaveBeenCalledWith(mockCleanedValue, true);
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
});
