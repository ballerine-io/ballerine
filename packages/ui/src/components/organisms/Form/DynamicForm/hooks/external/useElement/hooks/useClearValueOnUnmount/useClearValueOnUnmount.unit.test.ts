import { useStack } from '@/components/organisms/Form/DynamicForm/fields/FieldList/providers/StackProvider';
import { IFormElement } from '@/components/organisms/Form/DynamicForm/types';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useUnmount } from '../../../../internal/useUnmount';
import { useField } from '../../../useField';
import { useClearValueOnUnmount } from './useClearValueOnUnmount';

vi.mock('@/components/organisms/Form/DynamicForm/fields/FieldList/providers/StackProvider');
vi.mock('../../../useField');
vi.mock('../../../../internal/useUnmount');

describe('useClearValueOnUnmount', () => {
  const mockElement = {
    id: 'test-element',
  } as IFormElement<any, any>;

  const mockOnChange = vi.fn();
  const mockUnmountCallback = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useStack).mockReturnValue({ stack: [] });
    vi.mocked(useField).mockReturnValue({ onChange: mockOnChange } as any);
    vi.mocked(useUnmount).mockImplementation(callback => {
      mockUnmountCallback.mockImplementation(callback);
    });
  });

  it('should not clear value when hidden state has not changed', () => {
    renderHook(() => useClearValueOnUnmount(mockElement, false));

    mockUnmountCallback();

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should not clear value when element was already hidden', () => {
    renderHook(() => useClearValueOnUnmount(mockElement, true));

    mockUnmountCallback();

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should clear value when element becomes hidden', () => {
    const { rerender } = renderHook(({ hidden }) => useClearValueOnUnmount(mockElement, hidden), {
      initialProps: { hidden: false },
    });

    rerender({ hidden: true });
    mockUnmountCallback();

    expect(mockOnChange).toHaveBeenCalledWith(undefined, true);
  });

  it('should use stack from useStack hook', () => {
    const mockStack = [1, 2, 3];
    vi.mocked(useStack).mockReturnValue({ stack: mockStack });

    renderHook(() => useClearValueOnUnmount(mockElement, false));

    expect(useField).toHaveBeenCalledWith(mockElement, mockStack);
  });
});
