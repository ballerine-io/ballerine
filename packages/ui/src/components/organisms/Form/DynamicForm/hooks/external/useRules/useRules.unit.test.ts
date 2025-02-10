import { IRule } from '@/components/organisms/Form/hooks';
import { TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { replaceTagsWithIndexesInRule } from './helpers';
import { useRules } from './useRules';

vi.mock('./helpers', () => ({
  replaceTagsWithIndexesInRule: vi.fn(),
}));

describe('useRules', () => {
  const mockedReplaceTagsWithIndexesInRule = vi.mocked(replaceTagsWithIndexesInRule);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not call replaceTagsWithIndexesInRule with empty array if rules are undefined', () => {
    mockedReplaceTagsWithIndexesInRule.mockReturnValue([]);

    const { result } = renderHook(() => useRules(undefined, undefined));

    expect(mockedReplaceTagsWithIndexesInRule).not.toHaveBeenCalled();
    expect(result.current).toEqual([]);
  });

  it('should call replaceTagsWithIndexesInRule with provided rules and stack', () => {
    const rules: IRule[] = [
      {
        engine: 'json-logic',
        value: {
          var: 'some.path[$0]',
        },
      },
    ];
    const stack: TDeepthLevelStack = [1];

    const expectedResult: IRule[] = [
      {
        engine: 'json-logic',
        value: {
          var: 'some.path[1]',
        },
      },
    ];

    mockedReplaceTagsWithIndexesInRule.mockReturnValue(expectedResult);

    const { result } = renderHook(() => useRules(rules, stack));

    expect(mockedReplaceTagsWithIndexesInRule).toHaveBeenCalledWith(rules, stack);
    expect(mockedReplaceTagsWithIndexesInRule).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(expectedResult);
  });

  it('should memoize the result and not call replaceTagsWithIndexesInRule on re-renders if inputs have not changed', () => {
    const rules: IRule[] = [
      {
        engine: 'json-logic',
        value: {
          var: 'path[$0]',
        },
      },
    ];
    const stack: TDeepthLevelStack = [1];

    const expectedResult: IRule[] = [
      {
        engine: 'json-logic',
        value: {
          var: 'path[1]',
        },
      },
    ];

    mockedReplaceTagsWithIndexesInRule.mockReturnValue(expectedResult);

    const { result, rerender } = renderHook(() => useRules(rules, stack));

    expect(mockedReplaceTagsWithIndexesInRule).toHaveBeenCalledTimes(1);

    rerender();

    expect(mockedReplaceTagsWithIndexesInRule).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(expectedResult);
  });

  it('should call replaceTagsWithIndexesInRule again if rules change', () => {
    const initialRules: IRule[] = [
      {
        engine: 'json-logic',
        value: {
          var: 'path[$0]',
        },
      },
    ];
    const newRules: IRule[] = [
      {
        engine: 'json-logic',
        value: {
          var: 'newPath[$0]',
        },
      },
    ];
    const stack: TDeepthLevelStack = [1];

    mockedReplaceTagsWithIndexesInRule
      .mockReturnValueOnce(initialRules)
      .mockReturnValueOnce(newRules);

    const { result, rerender } = renderHook(({ rules, stack }) => useRules(rules, stack), {
      initialProps: { rules: initialRules, stack },
    });

    expect(mockedReplaceTagsWithIndexesInRule).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(initialRules);

    rerender({ rules: newRules, stack });

    expect(mockedReplaceTagsWithIndexesInRule).toHaveBeenCalledTimes(2);
    expect(result.current).toBe(newRules);
  });
});
