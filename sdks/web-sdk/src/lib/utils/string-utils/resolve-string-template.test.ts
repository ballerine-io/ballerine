import { resolveStringTemplate } from './resolve-string-template';

describe('resolveStringTemplate', () => {
  const base = 'http://dev.example.com/v2/';
  const str = base + '${verificationId}/${clientId}';
  const invalidObjs = [null, {}];

  invalidObjs.forEach(obj => {
    it(`should return the original string if ${JSON.stringify(obj)} is passed`, () => {
      // @ts-expect-error - testing the function with invalid arguments
      expect(resolveStringTemplate(str, obj)).toEqual(str);
    });
  });

  it("should replace every ${} with the object's value", () => {
    expect(
      resolveStringTemplate(str, {
        verificationId: 'testVerificationId',
        clientId: 'testClientId',
      }),
    ).toEqual(base + 'testVerificationId/testClientId');
  });
});
