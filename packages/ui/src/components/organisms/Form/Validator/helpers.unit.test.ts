import { describe, expect, it } from 'vitest';
import { checkIfValid } from './helpers';
import { IValidationError } from './types';

describe('helpers', () => {
  describe('checkIfValid', () => {
    it('should return true if there are no errors', () => {
      expect(checkIfValid([])).toBe(true);
    });

    it('should return false if there are errors', () => {
      expect(
        checkIfValid([{ message: 'error', element: 'element' } as unknown as IValidationError]),
      ).toBe(false);
    });
  });
});
