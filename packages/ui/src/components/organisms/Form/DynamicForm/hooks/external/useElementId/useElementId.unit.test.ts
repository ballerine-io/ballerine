import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IFormElement } from '../../../types';
import { useElementId } from './useElementId';

describe('useElementId', () => {
  describe('when stack not provided', () => {
    it('should return unmodified id', () => {
      const element = { id: 'test-id' } as IFormElement;

      const { result } = renderHook(() => useElementId(element));

      expect(result.current).toBe('test-id');
    });
  });

  describe('when stack provided', () => {
    it('should format id with stack', () => {
      const element = { id: 'test-id' } as IFormElement;
      const stack = [1, 2];

      const { result } = renderHook(() => useElementId(element, stack));

      expect(result.current).toBe('test-id-1-2');
    });

    it('should format id with empty stack', () => {
      const element = { id: 'test-id' } as IFormElement;
      const stack: number[] = [];

      const { result } = renderHook(() => useElementId(element, stack));

      expect(result.current).toBe('test-id');
    });
  });
});
