import { IRuleExecutionResult, useRuleEngine } from '@/components/organisms/Form/hooks';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDynamicForm } from '../../../context';
import { IFormElement } from '../../../types';
import { useEvents } from '../../internal/useEvents';
import { useMount } from '../../internal/useMount';
import { useUnmount } from '../../internal/useUnmount';
import { useElementId } from '../useElementId';
import { useElement } from './useElement';

vi.mock('@/components/organisms/Form/hooks/useRuleEngine');
vi.mock('../../../context');
vi.mock('../../internal/useEvents');
vi.mock('../../internal/useMount');
vi.mock('../../internal/useUnmount');
vi.mock('../useElementId');

describe('useElement', () => {
  const mockSendEvent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDynamicForm).mockReturnValue({
      values: {
        test: 1,
      },
    } as any);

    vi.mocked(useEvents).mockReturnValue({
      sendEvent: mockSendEvent,
      sendEventAsync: vi.fn(),
    } as any);

    vi.mocked(useElementId).mockImplementation((element, stack) => {
      if (!stack?.length) return element.id;

      return `${element.id}-${stack.join('-')}`;
    });

    vi.mocked(useRuleEngine).mockReturnValue([]);
  });

  describe('when stack not provided', () => {
    it('should return unmodified id and origin id', () => {
      const element = { id: 'test-id' } as IFormElement;

      const { result } = renderHook(() => useElement(element));

      expect(result.current.id).toBe('test-id');
      expect(result.current.originId).toBe('test-id');
    });
  });

  describe('when stack provided', () => {
    it('should format id with stack', () => {
      const element = { id: 'test-id' } as IFormElement;
      const stack = [1, 2];

      const { result } = renderHook(() => useElement(element, stack));

      expect(result.current.id).toBe(`${element.id}-1-2`);
      expect(result.current.originId).toBe(element.id);
    });
  });

  describe('when hidden rules provided', () => {
    it('should return hidden true when all hidden rules return true', () => {
      vi.mocked(useRuleEngine).mockReturnValue([
        { result: true },
        { result: true },
      ] as IRuleExecutionResult[]);

      const element = {
        id: 'test-id',
        hidden: [{ engine: 'json-logic', value: { '==': [{ var: 'test' }, 1] } }],
      } as IFormElement;

      const { result } = renderHook(() => useElement(element));

      expect(result.current.hidden).toBe(true);
    });

    it('should return hidden false when any hidden rule returns false', () => {
      vi.mocked(useRuleEngine).mockReturnValue([
        { result: true },
        { result: false },
      ] as IRuleExecutionResult[]);

      const element = {
        id: 'test-id',
        hidden: [{ engine: 'json-logic', value: { '==': [{ var: 'test' }, 5] } }],
      } as IFormElement;

      const { result } = renderHook(() => useElement(element));

      expect(result.current.hidden).toBe(false);
    });

    it('should return hidden false when no rules exist', () => {
      vi.mocked(useRuleEngine).mockReturnValue([]);

      const element = {
        id: 'test-id',
      } as IFormElement;

      const { result } = renderHook(() => useElement(element));

      expect(result.current.hidden).toBe(false);
    });
  });

  describe('lifecycle events', () => {
    it('should call sendEvent with onMount on mount', () => {
      const element = { id: 'test-id' } as IFormElement;

      renderHook(() => useElement(element));

      expect(useMount).toHaveBeenCalledWith(expect.any(Function));
      const mountCallback = vi.mocked(useMount).mock.calls[0]?.[0];

      if (mountCallback) {
        mountCallback();
      }

      expect(mockSendEvent).toHaveBeenCalledWith('onMount');
    });

    it('should call sendEvent with onUnmount on unmount', () => {
      const element = { id: 'test-id' } as IFormElement;

      renderHook(() => useElement(element));

      expect(useUnmount).toHaveBeenCalledWith(expect.any(Function));
      const unmountCallback = vi.mocked(useUnmount).mock.calls[0]?.[0];

      if (unmountCallback) {
        unmountCallback();
      }

      expect(mockSendEvent).toHaveBeenCalledWith('onUnmount');
    });
  });
});
