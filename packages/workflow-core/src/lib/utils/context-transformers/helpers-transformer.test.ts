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

    // Add a test for error handling
    it('should throw an error if the data is not an array', async () => {
      const data = { data: 'not an array', mergeValue: 'test' };

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

      await expect(transformer.transform(data)).rejects.toThrow();
  });

  describe('#setTimeToRecordUTC', () => {
    it('sets the time to the path', async () => {
      const data = { data: { object: 'test', test: 'object' }, mergeValue: 'test' };

      const transformer = new HelpersTransformer([
        {
          source: 'data.invokedAt',
          target: 'data.invokedAt',
          method: 'setTimeToRecordUTC',
        },
      ]);

      const response = await transformer.transform(data);

      expect(response).toEqual({
        data: { object: 'test', test: 'object', invokedAt: expect.any(Number) },
        mergeValue: 'test',
      });

      expect(new Date((response as { data: { invokedAt: number } }).data.invokedAt)).toEqual(
        expect.any(Date),
      );
    });
  });
});
