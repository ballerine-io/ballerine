import { describe, expect, it } from 'vitest';
import { formatErrorMessage } from './format-error-message';

describe('formatErrorMessage', () => {
  it('should replace single placeholder with value', () => {
    const message = 'This is a {test} message';
    const result = formatErrorMessage(message, 'test', 'sample');
    expect(result).toBe('This is a sample message');
  });

  it('should replace multiple occurrences of the same placeholder', () => {
    const message = 'The {value} is equal to {value}';
    const result = formatErrorMessage(message, 'value', '42');
    expect(result).toBe('The 42 is equal to 42');
  });

  it('should not modify message when placeholder is not found', () => {
    const message = 'This message has no placeholders';
    const result = formatErrorMessage(message, 'key', 'value');
    expect(result).toBe('This message has no placeholders');
  });

  it('should handle empty strings', () => {
    const message = '';
    const result = formatErrorMessage(message, 'key', 'value');
    expect(result).toBe('');
  });

  it('should handle special characters in placeholder values', () => {
    const message = 'Special {char} test';
    const result = formatErrorMessage(message, 'char', '$@#');
    expect(result).toBe('Special $@# test');
  });
});
