import { TransformerPlugin } from './transformer-plugin';
import { describe, expect, it } from 'vitest';

describe('transformer plugin', () => {
  describe('data mutation', () => {
    describe('transformer "helpers"', () => {
      it('will remove data at given destination path', async () => {
        const testData = {
          some: {
            path: {
              to: {
                value: 'hello world',
              },
            },
          },
        };

        const plugin = new TransformerPlugin({
          stateNames: [],
          name: 'test',
          transformers: [
            {
              transformer: 'helpers',
              mapping: [
                {
                  source: 'some.path.to.value',
                  target: 'some.path.to.value',
                  method: 'remove',
                },
              ],
            },
          ],
        });

        await plugin.invoke(testData);

        expect(testData).toEqual({
          some: {
            path: {
              to: {
                value: undefined,
              },
            },
          },
        });
      });
    });
  });
});
