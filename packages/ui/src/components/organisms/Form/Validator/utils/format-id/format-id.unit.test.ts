import { describe, expect, it } from 'vitest';
import { formatId } from './format-id';

describe('formatId', () => {
  it('should append stack values to id', () => {
    const id = 'test';
    const stack = [1, 2];

    const result = formatId(id, stack);

    expect(result).toBe('test-1-2');
  });

  it('should handle empty stack', () => {
    const id = 'test';
    const stack: number[] = [];

    const result = formatId(id, stack);

    expect(result).toBe('test');
  });

  it('should handle single stack value', () => {
    const id = 'test';
    const stack = [1];

    const result = formatId(id, stack);

    expect(result).toBe('test-1');
  });
});
