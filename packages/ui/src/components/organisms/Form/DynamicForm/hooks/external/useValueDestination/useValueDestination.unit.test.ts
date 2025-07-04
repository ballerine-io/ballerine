import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useValueDestination } from './useValueDestination';
import { TUIElement } from '@ballerine/common';

describe('useValueDestination', () => {
  describe('when stack not provided', () => {
    it('should return unmodified valueDestination', () => {
      const element = { valueDestination: 'test.path' } as TUIElement;

      const { result } = renderHook(() => useValueDestination(element));

      expect(result.current).toBe('test.path');
    });
  });

  describe('when stack provided', () => {
    it('should format valueDestination with stack', () => {
      const element = { valueDestination: 'test[$0].path[$1]' } as TUIElement;
      const stack = [1, 2];

      const { result } = renderHook(() => useValueDestination(element, stack));

      expect(result.current).toBe('test[1].path[2]');
    });

    it('should format valueDestination with empty stack', () => {
      const element = { valueDestination: 'test[$0].path[$1]' } as TUIElement;
      const stack: number[] = [];

      const { result } = renderHook(() => useValueDestination(element, stack));

      expect(result.current).toBe('test[$0].path[$1]');
    });

    it('should format valueDestination with partial stack usage', () => {
      const element = { valueDestination: 'test[$0].path[$1]' } as TUIElement;
      const stack = [1, 2];

      const { result } = renderHook(() => useValueDestination(element, stack));

      expect(result.current).toBe('test[1].path[2]');
    });
  });
});
