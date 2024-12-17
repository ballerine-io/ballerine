import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IDynamicFormContext, useDynamicForm } from '../../../context';
import { IFormElement } from '../../../types';
import { useCallbacks } from '../../internal/useCallbacks';
import { useElement } from './useElement';

vi.mock('../../../context');
vi.mock('../../../hooks/internal/useCallbacks');

describe('useElement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDynamicForm).mockReturnValue({
      values: {
        test: 1,
      },
    } as unknown as IDynamicFormContext<object>);

    vi.mocked(useCallbacks).mockReturnValue({
      onEvent: vi.fn(),
    });

    vi.useFakeTimers();
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
      vi.mocked(useDynamicForm).mockReturnValue({
        values: {
          test: 1,
        },
      } as IDynamicFormContext<object>);

      const element = {
        id: 'test-id',
        hidden: [{ engine: 'json-logic', value: { '==': [{ var: 'test' }, 1] } }],
      } as IFormElement;

      const { result } = renderHook(() => useElement(element));

      expect(result.current.hidden).toBe(true);
    });

    it('should return hidden false when any hidden rule returns false', () => {
      const element = {
        id: 'test-id',
        hidden: [{ engine: 'json-logic', value: { '==': [{ var: 'test' }, 5] } }],
      } as IFormElement;

      const { result } = renderHook(() => useElement(element));

      expect(result.current.hidden).toBe(false);
    });

    describe('when rules change', () => {
      it('should move from hidden false to hidden true when rules change', async () => {
        vi.mocked(useDynamicForm).mockReturnValue({
          values: {
            test: 1,
          },
        } as IDynamicFormContext<object>);

        const element = {
          id: 'test-id',
          hidden: [{ engine: 'json-logic', value: { '==': [{ var: 'test' }, 5] } }],
        } as IFormElement;

        const { result, rerender } = renderHook(() => useElement(element));

        expect(result.current.hidden).toBe(false);

        element.hidden = [{ engine: 'json-logic', value: { '==': [{ var: 'test' }, 1] } }];

        rerender();

        await vi.advanceTimersByTimeAsync(500);

        expect(result.current.hidden).toBe(true);
      });

      it('should move from hidden true to hidden false when rules change', async () => {
        vi.mocked(useDynamicForm).mockReturnValue({
          values: {
            test: 1,
          },
        } as IDynamicFormContext<object>);

        const element = {
          id: 'test-id',
          hidden: [{ engine: 'json-logic', value: { '==': [{ var: 'test' }, 1] } }],
        } as IFormElement;

        const { result, rerender } = renderHook(() => useElement(element));

        expect(result.current.hidden).toBe(true);

        element.hidden = [{ engine: 'json-logic', value: { '==': [{ var: 'test' }, 5] } }];

        rerender();

        await vi.advanceTimersByTimeAsync(500);

        expect(result.current.hidden).toBe(false);
      });
    });

    describe('when values change', () => {
      it('should move from hidden true to hidden false when values change', async () => {
        vi.mocked(useDynamicForm).mockReturnValue({
          values: {
            test: 1,
          },
        } as IDynamicFormContext<object>);

        const element = {
          id: 'test-id',
          hidden: [{ engine: 'json-logic', value: { '==': [{ var: 'test' }, 1] } }],
        } as IFormElement;

        const { result, rerender } = renderHook(() => useElement(element));

        expect(result.current.hidden).toBe(true);

        vi.mocked(useDynamicForm).mockReturnValue({
          values: {
            test: 5,
          },
        } as IDynamicFormContext<object>);

        rerender();

        await vi.advanceTimersByTimeAsync(500);

        expect(result.current.hidden).toBe(false);
      });

      it('should move from hidden false to hidden true when values change', async () => {
        vi.mocked(useDynamicForm).mockReturnValue({
          values: {
            test: 1,
          },
        } as IDynamicFormContext<object>);

        const element = {
          id: 'test-id',
          hidden: [{ engine: 'json-logic', value: { '==': [{ var: 'test' }, 5] } }],
        } as IFormElement;

        const { result, rerender } = renderHook(() => useElement(element));

        expect(result.current.hidden).toBe(false);

        vi.mocked(useDynamicForm).mockReturnValue({
          values: {
            test: 5,
          },
        } as IDynamicFormContext<object>);

        rerender();

        await vi.advanceTimersByTimeAsync(500);

        expect(result.current.hidden).toBe(true);
      });
    });
  });
});
