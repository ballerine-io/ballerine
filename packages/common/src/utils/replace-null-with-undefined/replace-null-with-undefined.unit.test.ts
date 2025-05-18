import { describe, expect, it } from 'vitest';
import { replaceNullsWithUndefined } from './replace-null-with-undefined';

describe('replaceNullsWithUndefined', () => {
  it('replaces nulls in objects recursively', () => {
    const input = { a: null, b: { c: null, d: 1 } };
    expect(replaceNullsWithUndefined(input)).toEqual({ a: undefined, b: { c: undefined, d: 1 } });
  });

  it('replaces nulls inside arrays', () => {
    const input = { arr: [null, { x: null }, 1] };
    expect(replaceNullsWithUndefined(input)).toEqual({ arr: [undefined, { x: undefined }, 1] });
  });
});
