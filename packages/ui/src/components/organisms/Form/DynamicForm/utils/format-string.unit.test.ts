import { describe, expect, it } from 'vitest';
import { formatString } from './format-string';

describe('formatString', () => {
  it('should return original string if no matches found', () => {
    const input = 'test string';
    const metadata = { key: 'value' };

    const result = formatString(input, metadata);

    expect(result).toBe(input);
  });

  it('should replace single placeholder with metadata value', () => {
    const input = 'Hello {name}';
    const metadata = { name: 'John' };

    const result = formatString(input, metadata);

    expect(result).toBe('Hello John');
  });

  it('should replace multiple placeholders with metadata values', () => {
    const input = '{greeting} {name}';
    const metadata = {
      greeting: 'Hello',
      name: 'John',
    };

    const result = formatString(input, metadata);

    expect(result).toBe('Hello John');
  });

  it('should keep placeholders unchanged when metadata is empty', () => {
    const input = 'Hello {name}, your ID is {userId}';
    const metadata = {};

    const result = formatString(input, metadata);

    expect(result).toBe('Hello {name}, your ID is {userId}');
  });
});
