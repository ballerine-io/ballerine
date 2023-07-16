import { describe, expect, it } from 'vitest';
import { HelpersTransformer } from './helpers-transformer';

describe('jmespath transform', () => {
  describe('extract json', () => {
    it('transforms to date', async () => {
      const date = { person: { dateOfBirth: '2003-07-02T14:31:11.116Z' } };
      const transformer = new HelpersTransformer([
        {
          source: 'person.dateOfBirth',
          target: 'person.dateOfBirth',
          method: 'regex',
          value: '\\d{4}-\\d{2}-\\d{2}',
        },
      ]);
      const response = await transformer.transform(date);
      expect(response).toEqual({ person: { dateOfBirth: '2003-07-02' } });
    });
  });
});
