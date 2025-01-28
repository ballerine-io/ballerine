import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDynamicForm } from '../../../../context';
import { useField } from '../../../../hooks/external';
import { IFormElement } from '../../../../types';
import { useStack } from '../../providers/StackProvider';
import { IUseFieldParams, useFieldList } from './useFieldList';

vi.mock('../../../../hooks/external');
vi.mock('../../providers/StackProvider');
vi.mock('../../../../context');

describe('useFieldList', () => {
  const mockElement = {
    id: 'test',
    valueDestination: 'test',
    element: 'fieldlist',
    params: {
      defaultValue: 'test.value',
    },
  } as IFormElement<string, IUseFieldParams>;

  const mockOnChange = vi.fn();
  const mockStack = [0];
  const mockValues = {
    test: {
      value: 'defaultValue',
    },
  };

  beforeEach(() => {
    vi.mocked(useStack).mockReturnValue({ stack: mockStack });
    vi.mocked(useField).mockReturnValue({
      onChange: mockOnChange,
      value: [],
    } as unknown as ReturnType<typeof useField>);
    vi.mocked(useDynamicForm).mockReturnValue({
      values: mockValues,
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty array if no value provided', () => {
    const { result } = renderHook(() => useFieldList({ element: mockElement }));
    expect(result.current.items).toEqual([]);
  });

  it('should add item with default value from jsonata expression', async () => {
    const { result } = renderHook(() => useFieldList({ element: mockElement }));

    await result.current.addItem();

    expect(mockOnChange).toHaveBeenCalledWith(['defaultValue']);
  });

  it('should add defaultValue as is when no default value provided', async () => {
    const elementWithoutDefault = {
      ...mockElement,
      params: {},
    };

    const { result } = renderHook(() => useFieldList({ element: elementWithoutDefault }));

    await result.current.addItem();

    expect(mockOnChange).toHaveBeenCalledWith([undefined]);
  });

  it('should log message when default value is missing', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const elementWithoutDefault = {
      ...mockElement,
      params: {},
    };

    const { result } = renderHook(() => useFieldList({ element: elementWithoutDefault }));

    await result.current.addItem();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Default value is missing for',
      elementWithoutDefault.id,
    );
  });

  it('should remove item at specified index', () => {
    const existingItems = ['item1', 'item2', 'item3'];
    vi.mocked(useField).mockReturnValue({
      onChange: mockOnChange,
      value: existingItems,
    } as unknown as ReturnType<typeof useField>);

    const { result } = renderHook(() => useFieldList({ element: mockElement }));

    result.current.removeItem(1);

    expect(mockOnChange).toHaveBeenCalledWith(['item1', 'item3']);
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
