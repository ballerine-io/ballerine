import { IFormElement } from '@/components/organisms/Form/DynamicForm/types';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useStack } from '../../../../../fields';
import { useClear } from '../../../../internal/useClear';
import { useUnmount } from '../../../../internal/useUnmount';
import { useField } from '../../../useField';
import { useClearValueOnUnmount } from './useClearValueOnUnmount';

vi.mock('../../../../internal/useClear', () => ({
  useClear: vi.fn(),
}));
vi.mock('../../../../internal/useUnmount', () => ({
  useUnmount: vi.fn(),
}));
vi.mock('../../../useField', () => ({
  useField: vi.fn(),
}));
vi.mock('../../../../../fields', () => ({
  useStack: vi.fn(),
}));

describe('useClearValueOnUnmount', () => {
  const mockElement = {
    id: 'test-element',
    element: 'test',
  } as IFormElement<any, any>;

  const mockClean = vi.fn();
  const mockValue = 'test-value';

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useClear).mockReturnValue(mockClean);
    vi.mocked(useStack).mockReturnValue({ stack: [] });
    vi.mocked(useField).mockReturnValue({ value: mockValue } as any);
    vi.mocked(useUnmount).mockImplementation(callback => callback());
  });

  it('should call clean when element becomes hidden', () => {
    renderHook(() => useClearValueOnUnmount(mockElement, true));

    expect(mockClean).not.toHaveBeenCalled();
  });

  it('should not call clean when element stays visible', () => {
    renderHook(() => useClearValueOnUnmount(mockElement, false));

    expect(mockClean).not.toHaveBeenCalled();
  });

  it('should call clean with value when element transitions from visible to hidden', () => {
    // First render - element is visible
    const { rerender } = renderHook(({ hidden }) => useClearValueOnUnmount(mockElement, hidden), {
      initialProps: { hidden: false },
    });

    // Second render - element becomes hidden
    rerender({ hidden: true });

    expect(mockClean).toHaveBeenCalledWith(mockValue);
    expect(mockClean).toHaveBeenCalledTimes(1);
  });

  it('should not call clean when element transitions from hidden to visible', () => {
    // First render - element is hidden
    const { rerender } = renderHook(({ hidden }) => useClearValueOnUnmount(mockElement, hidden), {
      initialProps: { hidden: true },
    });

    // Second render - element becomes visible
    rerender({ hidden: false });

    expect(mockClean).not.toHaveBeenCalled();
  });
});
