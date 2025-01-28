import { AnyObject } from '@/common';
import { describe, expect, it } from 'vitest';
import { formatString } from './format-string';

describe('formatString', () => {
  it('should return original string if no matches found', () => {
    const input = 'test string';
    const metadata = { key: 'value' };

    const result = formatString(input, metadata as AnyObject);

    expect(result).toBe(input);
  });

  it('should replace single placeholder with metadata value', () => {
    const input = 'Hello {name}';
    const metadata = { name: 'John' };

    const result = formatString(input, metadata as AnyObject);

    expect(result).toBe('Hello John');
  });

  it('should replace multiple placeholders with metadata values', () => {
    const input = '{greeting} {name}';
    const metadata = {
      greeting: 'Hello',
      name: 'John',
    };

    const result = formatString(input, metadata as AnyObject);

    expect(result).toBe('Hello John');
  });

  it('should keep placeholders unchanged when metadata is empty', () => {
    const input = 'Hello {name}, your ID is {userId}';
    const metadata = {};

    const result = formatString(input, metadata as AnyObject);

    expect(result).toBe('Hello {name}, your ID is {userId}');
  });

  it('should handle nested metadata properties', () => {
    const input = 'Hello {user.name}, your role is {user.role.type}';
    const metadata = {
      user: {
        name: 'John',
        role: {
          type: 'admin',
        },
      },
    };

    const result = formatString(input, metadata as AnyObject);

    expect(result).toBe('Hello John, your role is admin');
  });
});
