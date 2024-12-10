import { describe, expect, it } from 'vitest';
import { IRendererElement } from '../types';
import { createTestId } from './create-test-id';

describe('createTestId', () => {
  it('should create test id from element id when no stack provided', () => {
    const element = { id: 'test-element' } as IRendererElement;
    const result = createTestId(element);
    expect(result).toBe('test-element');
  });

  it('should create test id from element id and stack when stack provided', () => {
    const element = { id: 'test-element' } as IRendererElement;
    const stack = [1, 2, 3];
    const result = createTestId(element, stack);
    expect(result).toBe('test-element-1-2-3');
  });

  it('should handle empty stack array', () => {
    const element = { id: 'test-element' } as IRendererElement;
    const stack: number[] = [];
    const result = createTestId(element, stack);
    expect(result).toBe('test-element');
  });

  it('should handle single stack number', () => {
    const element = { id: 'test-element' } as IRendererElement;
    const stack = [1];
    const result = createTestId(element, stack);
    expect(result).toBe('test-element-1');
  });
});
