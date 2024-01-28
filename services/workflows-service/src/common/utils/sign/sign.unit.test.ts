import { sign } from './sign';

const cases: Array<{
  name: string;
  payload: unknown;
  differentPayload: unknown;
  expectedSignature: string;
}> = [
  {
    name: 'When the payload is an object',
    payload: { foo: 'bar' },
    differentPayload: { foo: 'baz' },
    expectedSignature: '3f3ab3986b656abb17af3eb1443ed6c08ef8fff9fea83915909d1b421aec89be',
  },
  {
    name: 'When the payload is an array',
    payload: ['foo', 'bar'],
    differentPayload: ['foo', 'baz'],
    expectedSignature: '769398ed925a354d635cb5f7a270ac964435b37d5d23dde70d1b78ba6f942a19',
  },
  {
    name: 'When the payload is a string',
    payload: 'foo',
    differentPayload: 'bar',
    expectedSignature: '1fd4b20936f4b6f974de6a5dd9b01d2bbf2e07204a781fda924215240faa059a',
  },
];

describe('sign', () => {
  describe.each(cases)('$name', ({ payload, differentPayload, expectedSignature }) => {
    test('When signing a payload, it should return a signature', () => {
      // Arrange
      const key = 'secret';

      // Act
      const signature = sign({ payload, key });

      // Assert
      expect(signature).toBe(expectedSignature);
    });

    test('When signing the same payload with a different key, it should return a different signature', () => {
      // Arrange
      const key1 = 'secret';
      const key2 = 'secret2';

      // Act
      const signature1 = sign({ payload, key: key1 });
      const signature2 = sign({ payload, key: key2 });

      // Assert
      expect(signature1).not.toBe(signature2);
    });

    test('When signing different payloads with the same key, it should return different signatures', () => {
      // Arrange
      const key = 'secret';

      // Act
      const signature1 = sign({ payload: payload, key });
      const signature2 = sign({ payload: differentPayload, key });

      // Assert
      expect(signature1).not.toBe(signature2);
    });
  });
});
