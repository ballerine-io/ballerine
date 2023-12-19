import { describe, expect, it } from 'vitest';
import { HelpersTransformer } from './helpers-transformer';

describe('Helper transform', () => {
  describe('#mergeArrayEachItemWithValue', () => {
    it('it maps each object of the array with additional selection value', async () => {
      const data = { data: [{ test: 'value' }, { test: 'value2' }], mergeValue: 'test' };

      const transformer = new HelpersTransformer([
        {
          source: 'data',
          target: 'data',
          method: 'mergeArrayEachItemWithValue',
          value: '_',
          options: {
            mapJmespath: 'data',
            mergeWithJmespath: '{theValueToMerge: mergeValue}',
          },
        },
      ]);

      const response = await transformer.transform(data);

      expect(response).toEqual({
        data: [
          {
            test: 'value',
            theValueToMerge: 'test',
          },
          {
            test: 'value2',
            theValueToMerge: 'test',
          },
        ],
        mergeValue: 'test',
      });
    });
  });
});
