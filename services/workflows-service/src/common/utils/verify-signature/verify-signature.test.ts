import { verifySignature } from './verify-signature';

const cases: Array<{
  name: string;
  valid: {
    payload: unknown;
    signature: string;
  };
  invalid: {
    payload: unknown;
    signature: string;
  };
}> = [
  {
    name: 'When the payload is an object',
    valid: {
      payload: { foo: 'bar' },
      signature: '3f3ab3986b656abb17af3eb1443ed6c08ef8fff9fea83915909d1b421aec89be',
    },
    invalid: {
      payload: { foo: 'bar' },
      signature: '::invalid-signature::',
    },
  },
  {
    name: 'When the payload is an array',
    valid: {
      payload: ['foo', 'bar'],
      signature: '769398ed925a354d635cb5f7a270ac964435b37d5d23dde70d1b78ba6f942a19',
    },
    invalid: {
      payload: ['foo', 'bar'],
      signature: '::invalid-signature::',
    },
  },
  {
    name: 'When the payload is a string',
    valid: {
      payload: 'foo',
      signature: '1fd4b20936f4b6f974de6a5dd9b01d2bbf2e07204a781fda924215240faa059a',
    },
    invalid: {
      payload: 'foo',
      signature: '::invalid-signature::',
    },
  },
];

describe('verifySignature', () => {
  describe.each(cases)('$name', ({ valid, invalid }) => {
    test('And the signature is valid, it should return true', () => {
      // Arrange
      const key = 'secret';
      const payload = valid.payload;
      const signature = valid.signature;

      // Act
      const isVerified = verifySignature({ signature, payload, key });

      // Assert
      expect(isVerified).toBe(true);
    });

    test('And the signature is invalid, it should return false', () => {
      // Arrange
      const key = 'secret';
      const payload = invalid.payload;
      const signature = invalid.signature;

      // Act
      const isVerified = verifySignature({ signature, payload, key });

      // Assert
      expect(isVerified).toBe(false);
    });
  });
});
