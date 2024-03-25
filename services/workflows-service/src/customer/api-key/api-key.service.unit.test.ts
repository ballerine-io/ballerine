import { generateSalt, hashKey } from './utils';

describe('Checks hashing utils', () => {
  it('should genereate random salt', async () => {
    const salt1 = await generateSalt();
    const salt2 = await generateSalt();

    expect(salt1).toBeDefined();
    expect(salt2).toBeDefined();

    expect(salt1).not.toEqual(salt2);
  });

  it('should genereate key with a random salt', async () => {
    const salt1 = await generateSalt();
    const salt2 = await generateSalt();

    const hashedKey1 = await hashKey('abcde', salt1);
    const hashedKey2 = await hashKey('abcde', salt2);

    expect(hashedKey1).toBeDefined();
    expect(hashedKey2).toBeDefined();

    expect(hashedKey1).not.toEqual(hashedKey2);
  });

  it('should genereate same hashed key with same salt', async () => {
    const salt = await generateSalt();

    const key = 'test_key';

    const hashedKey1 = await hashKey(key, salt);
    const hashedKey2 = await hashKey(key, salt);

    expect(hashedKey1).toBeDefined();
    expect(hashedKey2).toBeDefined();

    expect(hashedKey1).toEqual(hashedKey2);
  });

  it('Checks key has minimum length ', async () => {
    const key = 'test';

    await expect(async () => hashKey(key)).rejects.toThrow('Invalid key length');
  });
});
