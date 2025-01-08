import { IRule } from '@/components/organisms/Form/hooks';
import { TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { describe, expect, it } from 'vitest';
import { replaceTagsWithIndexesInRule } from './helpers';

describe('replaceTagsWithIndexesInRule', () => {
  it('should return original rules if stack is empty', () => {
    const rules: IRule[] = [
      {
        engine: 'json-logic',
        value: {},
      },
    ];

    const result = replaceTagsWithIndexesInRule(rules, []);
    expect(result).toEqual(rules);
  });

  it('should return original rules if stack is undefined', () => {
    const rules: IRule[] = [
      {
        engine: 'json-logic',
        value: {},
      },
    ];

    const result = replaceTagsWithIndexesInRule(rules, undefined);
    expect(result).toEqual(rules);
  });

  it('should replace tags with stack indexes in rules', () => {
    const rules: IRule[] = [
      {
        engine: 'json-logic',
        value: {
          var: 'some.path.$0.to.something.$1',
        },
      },
      {
        engine: 'json-logic',
        value: {
          var: 'some.path.$0.to.something.$1',
        },
      },
    ];

    const stack = [1, 2];

    const expected: IRule[] = [
      {
        engine: 'json-logic',
        value: {
          var: 'some.path.1.to.something.2',
        },
      },
      {
        engine: 'json-logic',
        value: {
          var: 'some.path.1.to.something.2',
        },
      },
    ];

    const result = replaceTagsWithIndexesInRule(rules, stack);
    expect(result).toEqual(expected);
  });

  it('shold keep original rules if stack is empty', () => {
    const rules: IRule[] = [
      {
        engine: 'json-logic',
        value: {
          var: 'some.path.$0.to.something.$1',
        },
      },
    ];

    const stack: TDeepthLevelStack = [];

    const result = replaceTagsWithIndexesInRule(rules, stack);
    expect(result).toEqual(rules);
  });
});
