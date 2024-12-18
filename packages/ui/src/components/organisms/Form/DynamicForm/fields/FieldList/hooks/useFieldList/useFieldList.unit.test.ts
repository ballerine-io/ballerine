import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useField } from '../../../../hooks/external';
import { IFormElement } from '../../../../types';
import { useStack } from '../../providers/StackProvider';
import { IUseFieldParams, useFieldList } from './useFieldList';

vi.mock('../../../../hooks/external');
vi.mock('../../providers/StackProvider');

describe('useFieldList', () => {
  const mockElement = {
    id: 'test',
    valueDestination: 'test',
    element: 'fieldlist',
    params: {
      defaultValue: { test: 'value' },
    },
  } as unknown as IFormElement<string, IUseFieldParams<object>>;

  const mockOnChange = vi.fn();
  const mockStack = [0];

  beforeEach(() => {
    vi.mocked(useStack).mockReturnValue({ stack: mockStack });
    vi.mocked(useField).mockReturnValue({
      onChange: mockOnChange,
      value: [],
    } as unknown as ReturnType<typeof useField>);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty array if no value provided', () => {
    const { result } = renderHook(() => useFieldList({ element: mockElement }));
    expect(result.current.items).toEqual([]);
  });

  it('should add item with default value', () => {
    const { result } = renderHook(() => useFieldList({ element: mockElement }));

    result.current.addItem();

    expect(mockOnChange).toHaveBeenCalledWith([{ test: 'value' }]);
  });

  it('should remove item at specified index', () => {
    const existingItems = [{ test: '1' }, { test: '2' }, { test: '3' }];
    vi.mocked(useField).mockReturnValue({
      onChange: mockOnChange,
      value: existingItems,
    } as unknown as ReturnType<typeof useField>);

    const { result } = renderHook(() => useFieldList({ element: mockElement }));

    result.current.removeItem(1);

    expect(mockOnChange).toHaveBeenCalledWith([{ test: '1' }, { test: '3' }]);
  });

  it('should not remove item if value is not an array', () => {
    vi.mocked(useField).mockReturnValue({
      onChange: mockOnChange,
      value: 'not-an-array' as any,
      touched: false,
      onBlur: vi.fn(),
    } as unknown as ReturnType<typeof useField>);

    const { result } = renderHook(() => useFieldList({ element: mockElement }));

    result.current.removeItem(0);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should pass stack to useField', () => {
    renderHook(() => useFieldList({ element: mockElement }));

    expect(useField).toHaveBeenCalledWith(mockElement, mockStack);
  });
});
