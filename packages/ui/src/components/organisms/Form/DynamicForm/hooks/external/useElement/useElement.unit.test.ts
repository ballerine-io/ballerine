import {
  IRuleExecutionResult,
  useRuleEngine,
} from '@/components/organisms/Form/hooks/useRuleEngine';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDynamicForm } from '../../../context';
import { IFormElement } from '../../../types';
import { useEvents } from '../../internal/useEvents';
import { useElementId } from '../useElementId';
import { useClearValueOnUnmount } from './hooks/useClearValueOnUnmount';
import { useElement } from './useElement';

vi.mock('@/components/organisms/Form/hooks/useRuleEngine');
vi.mock('../../../context');
vi.mock('../../internal/useEvents');
vi.mock('../useElementId');
vi.mock('./hooks/useClearValueOnUnmount');

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
    vi.mocked(useClearValueOnUnmount).mockImplementation(() => undefined);
  });

  describe('when stack not provided', () => {
    it('should return unmodified id and origin id', () => {
      const element = { id: 'test-id' } as IFormElement<string, any>;

      const { result } = renderHook(() => useElement(element));

      expect(result.current.id).toBe('test-id');
      expect(result.current.originId).toBe('test-id');
    });
  });

  describe('when stack provided', () => {
    it('should format id with stack', () => {
      const element = { id: 'test-id' } as IFormElement<string, any>;
      const stack = [1, 2];

      const { result } = renderHook(() => useElement(element, stack));

      expect(result.current.id).toBe(`${element.id}-1-2`);
      expect(result.current.originId).toBe(element.id);
    });
  });

  describe('when hidden rules provided', () => {
    it('should return hidden true when all hidden rules return true', () => {
      vi.mocked(useRuleEngine).mockReturnValue([
        { result: true, rule: {} },
        { result: true, rule: {} },
      ] as IRuleExecutionResult[]);

      const element = {
        id: 'test-id',
        hidden: [{ engine: 'json-logic', value: { '==': [{ var: 'test' }, 1] } }],
      } as IFormElement<string, any>;

      const { result } = renderHook(() => useElement(element));

      expect(result.current.hidden).toBe(true);
      expect(useRuleEngine).toHaveBeenCalledWith(
        { test: 1 },
        {
          rules: element.hidden,
          runOnInitialize: true,
          executionDelay: 500,
        },
      );
    });

    it('should return hidden false when any hidden rule returns false', () => {
      vi.mocked(useRuleEngine).mockReturnValue([
        { result: true, rule: {} },
        { result: false, rule: {} },
      ] as IRuleExecutionResult[]);

      const element = {
        id: 'test-id',
        hidden: [{ engine: 'json-logic', value: { '==': [{ var: 'test' }, 5] } }],
      } as IFormElement<string, any>;

      const { result } = renderHook(() => useElement(element));

      expect(result.current.hidden).toBe(false);
    });

    it('should return hidden false when no rules exist', () => {
      vi.mocked(useRuleEngine).mockReturnValue([]);

      const element = {
        id: 'test-id',
      } as IFormElement<string, any>;

      const { result } = renderHook(() => useElement(element));

      expect(result.current.hidden).toBe(false);
    });
  });

  describe('lifecycle events', () => {
    it('should call useClearValueOnUnmount with element and hidden state', () => {
      const element = { id: 'test-id' } as IFormElement<string, any>;
      vi.mocked(useRuleEngine).mockReturnValue([
        { result: true, rule: {} },
      ] as IRuleExecutionResult[]);

      renderHook(() => useElement(element));

      expect(useClearValueOnUnmount).toHaveBeenCalledWith(element, true);
    });
  });
});
