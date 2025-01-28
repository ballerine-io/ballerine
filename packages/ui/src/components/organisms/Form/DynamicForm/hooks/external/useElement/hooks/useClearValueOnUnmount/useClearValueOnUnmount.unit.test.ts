import { IFormElement } from '@/components/organisms/Form/DynamicForm/types';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useStack } from '../../../../../fields';
import { useClear } from '../../../../internal/useClear';
import { useField } from '../../../useField';
import { useClearValueOnUnmount } from './useClearValueOnUnmount';

vi.mock('../../../../internal/useClear');
vi.mock('../../../../../fields');
vi.mock('../../../useField');

describe('useClearValueOnUnmount', () => {
  const mockClean = vi.fn();
  const mockElement = { id: 'test-element' } as IFormElement<any, any>;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useClear).mockReturnValue(mockClean);
    vi.mocked(useStack).mockReturnValue({ stack: [] });
    vi.mocked(useField).mockReturnValue({
      value: 'test-value',
      touched: false,
      disabled: false,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      onFocus: vi.fn(),
    });
  });

  it('should not clean when hidden is false', () => {
    renderHook(() => useClearValueOnUnmount(mockElement, false));

    expect(mockClean).not.toHaveBeenCalled();
  });

  it('should not clean on initial mount when hidden is true', () => {
    renderHook(() => useClearValueOnUnmount(mockElement, true));

    expect(mockClean).not.toHaveBeenCalled();
  });

  it('should clean when hidden changes from false to true', () => {
    const { rerender } = renderHook(({ hidden }) => useClearValueOnUnmount(mockElement, hidden), {
      initialProps: { hidden: false },
    });

    rerender({ hidden: true });

    expect(mockClean).toHaveBeenCalledWith('test-value');
  });

  it('should not clean when hidden changes from true to false', () => {
    const { rerender } = renderHook(({ hidden }) => useClearValueOnUnmount(mockElement, hidden), {
      initialProps: { hidden: true },
    });

    rerender({ hidden: false });

    expect(mockClean).not.toHaveBeenCalled();
  });

  it('should use latest value when hidden changes', async () => {
    vi.mocked(useField).mockReturnValue({
      value: 'new-value',
      touched: false,
      disabled: false,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      onFocus: vi.fn(),
    });

    const { rerender } = renderHook(({ hidden }) => useClearValueOnUnmount(mockElement, hidden), {
      initialProps: { hidden: false },
    });

    rerender({ hidden: true });

    await waitFor(() => {
      expect(mockClean).toHaveBeenCalledWith('new-value');
    });

    vi.mocked(useField).mockReturnValue({
      value: 'test-value',
      touched: false,
      disabled: false,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      onFocus: vi.fn(),
    });

    rerender({ hidden: false });

    await waitFor(() => {
      expect(mockClean).toHaveBeenCalledTimes(1);
    });

    rerender({ hidden: true });

    await waitFor(() => {
      expect(mockClean).toHaveBeenCalledWith('test-value');
    });
  });
});
