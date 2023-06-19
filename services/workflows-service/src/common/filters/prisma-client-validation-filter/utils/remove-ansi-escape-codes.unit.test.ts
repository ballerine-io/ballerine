import { removeAnsiEscapeCodes } from './remove-ansi-escape-codes';

describe('removeAnsiEscapeCodes', () => {
  describe("when string does't include ansi codes", () => {
    it('will keep it untouched', () => {
      expect(removeAnsiEscapeCodes('Lorem ipsum dolor sit amet.')).toBe(
        'Lorem ipsum dolor sit amet.',
      );
    });
  });

  describe('when string includes ANSI', () => {
    it('will remove ANSI escape codes from string', () => {
      const ansiEncodedString = `Lorem \x1B[35mipsum\x1B[0m dolor sit amet, \x1B[33mconsectetur\x1B[0m adipiscing elit. Lorem \x1B[36mipsum\x1B[0m dolor sit amet, \x1B[31mconsectetur\x1B[0m adipiscing elit. Lorem \x1B[34mipsum\x1B[0m dolor sit amet, \x1B[32mconsectetur\x1B[0m adipiscing elit. Lorem \x1B[35mipsum\x1B[0m dolor sit amet, consectetur adipiscing elit.`;

      expect(removeAnsiEscapeCodes(ansiEncodedString)).toBe(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      );
    });
  });
});
