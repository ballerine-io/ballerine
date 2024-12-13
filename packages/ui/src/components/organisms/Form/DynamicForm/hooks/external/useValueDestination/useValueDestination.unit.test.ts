import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IFormElement } from '../../../types';
import { useValueDestination } from './useValueDestination';

describe('useValueDestination', () => {
  describe('when stack not provided', () => {
    it('should return unmodified valueDestination', () => {
      const element = { valueDestination: 'test.path' } as IFormElement;

      const { result } = renderHook(() => useValueDestination(element));

      expect(result.current).toBe('test.path');
    });
  });

  describe('when stack provided', () => {
    it('should format valueDestination with stack', () => {
      const element = { valueDestination: 'test[$0].path[$1]' } as IFormElement;
      const stack = [1, 2];

      const { result } = renderHook(() => useValueDestination(element, stack));

      expect(result.current).toBe('test[1].path[2]');
    });

    it('should format valueDestination with empty stack', () => {
      const element = { valueDestination: 'test[$0].path[$1]' } as IFormElement;
      const stack: number[] = [];

      const { result } = renderHook(() => useValueDestination(element, stack));

      expect(result.current).toBe('test[$0].path[$1]');
    });

    it('should format valueDestination with partial stack usage', () => {
      const element = { valueDestination: 'test[$0].path[$1]' } as IFormElement;
      const stack = [1, 2];

      const { result } = renderHook(() => useValueDestination(element, stack));

      expect(result.current).toBe('test[1].path[2]');
    });
  });
});
