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
      metadata: {
        someMetadata: 'test',
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

  describe('hidden state', () => {
    it('should return hidden false when no hidden rules exist', () => {
      const element = {
        id: 'test-id',
      } as IFormElement<string, any>;

      const { result } = renderHook(() => useElement(element));

      expect(result.current.hidden).toBe(false);
    });

    it('should return hidden false when hidden rules array is empty', () => {
      const element = {
        id: 'test-id',
        hidden: [],
      } as unknown as IFormElement<string, any>;

      const { result } = renderHook(() => useElement(element));

      expect(result.current.hidden).toBe(false);
    });

    it('should return hidden true when any hidden rule returns true', () => {
      vi.mocked(useRuleEngine).mockReturnValue([
        { result: false, rule: {} },
        { result: true, rule: {} },
      ] as IRuleExecutionResult[]);

      const element = {
        id: 'test-id',
        hidden: [{ engine: 'json-logic', value: { '==': [{ var: 'test' }, 1] } }],
      } as IFormElement<string, any>;

      const { result } = renderHook(() => useElement(element));

      expect(result.current.hidden).toBe(true);
    });

    it('should return hidden false when all hidden rules return false', () => {
      vi.mocked(useRuleEngine).mockReturnValue([
        { result: false, rule: {} },
        { result: false, rule: {} },
      ] as IRuleExecutionResult[]);

      const element = {
        id: 'test-id',
        hidden: [{ engine: 'json-logic', value: { '==': [{ var: 'test' }, 5] } }],
      } as IFormElement<string, any>;

      const { result } = renderHook(() => useElement(element));

      expect(result.current.hidden).toBe(false);
    });

    it('should pass combined values and metadata to useRuleEngine', () => {
      vi.mocked(useDynamicForm).mockReturnValue({
        values: { someValue: 'test-value' },
        metadata: { someMetadata: 'test-metadata' },
      } as any);

      const element = {
        id: 'test-id',
        hidden: [{ engine: 'json-logic', value: { '==': [{ var: 'test' }, 1] } }],
      } as IFormElement<string, any>;

      renderHook(() => useElement(element));

      expect(useRuleEngine).toHaveBeenCalledWith(
        { someValue: 'test-value', someMetadata: 'test-metadata' },
        {
          rules: element.hidden,
          runOnInitialize: true,
          executionDelay: 500,
        },
      );
    });

    it('should memoize hidden state', () => {
      vi.mocked(useRuleEngine).mockReturnValue([
        { result: true, rule: {} },
      ] as IRuleExecutionResult[]);

      const element = {
        id: 'test-id',
        hidden: [{ engine: 'json-logic', value: { '==': [{ var: 'test' }, 1] } }],
      } as IFormElement<string, any>;

      const { result, rerender } = renderHook(() => useElement(element));
      const initialHidden = result.current.hidden;

      rerender();

      expect(result.current.hidden).toBe(initialHidden);
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
