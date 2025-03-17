import { describe, expect, it } from 'vitest';
import { asyncCompose } from './async-compose';

describe('asyncCompose', () => {
  it('should compose async functions from right to left', async () => {
    const addOne = async (x: number) => x + 1;
    const multiplyByTwo = async (x: number) => x * 2;
    const subtractThree = async (x: number) => x - 3;

    const composed = asyncCompose(subtractThree, multiplyByTwo, addOne);
    const result = await composed(5);

    // ((5 + 1) * 2) - 3 = 9
    expect(result).toBe(9);
  });

  it('should work with mix of sync and async functions', async () => {
    const addOne = (x: number) => x + 1;
    const multiplyByTwo = async (x: number) => x * 2;
    const subtractThree = (x: number) => x - 3;

    const composed = asyncCompose(subtractThree, multiplyByTwo, addOne);
    const result = await composed(5);

    expect(result).toBe(9);
  });

  it('should handle single function', async () => {
    const addOne = async (x: number) => x + 1;

    const composed = asyncCompose(addOne);
    const result = await composed(5);

    expect(result).toBe(6);
  });

  it('should handle empty function array', async () => {
    const composed = asyncCompose();
    const result = await composed(5);

    expect(result).toBe(5);
  });

  it('should maintain function execution order', async () => {
    const executionOrder: number[] = [];

    const fn1 = async (x: number) => {
      executionOrder.push(1);

      return x;
    };
    const fn2 = async (x: number) => {
      executionOrder.push(2);

      return x;
    };
    const fn3 = async (x: number) => {
      executionOrder.push(3);

      return x;
    };

    const composed = asyncCompose(fn1, fn2, fn3);
    await composed(5);

    expect(executionOrder).toEqual([3, 2, 1]);
  });
});
