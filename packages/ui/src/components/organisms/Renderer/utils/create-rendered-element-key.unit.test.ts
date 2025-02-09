import { describe, expect, it } from 'vitest';
import { IRendererElement } from '../types';
import { createRenderedElementKey } from './create-rendered-element-key';

describe('createRenderedElementKey', () => {
  it('should create key from element id when no stack provided', () => {
    const element = { id: 'test-element' } as IRendererElement;
    const result = createRenderedElementKey(element);
    expect(result).toBe('test-element');
  });

  it('should create key from element id and stack when stack provided', () => {
    const element = { id: 'test-element' } as IRendererElement;
    const stack = [1, 2, 3];
    const result = createRenderedElementKey(element, stack);
    expect(result).toBe('test-element-1-2-3');
  });

  it('should handle empty stack array', () => {
    const element = { id: 'test-element' } as IRendererElement;
    const stack: number[] = [];
    const result = createRenderedElementKey(element, stack);
    expect(result).toBe('test-element');
  });

  it('should handle single stack number', () => {
    const element = { id: 'test-element' } as IRendererElement;
    const stack = [1];
    const result = createRenderedElementKey(element, stack);
    expect(result).toBe('test-element-1');
  });
});
