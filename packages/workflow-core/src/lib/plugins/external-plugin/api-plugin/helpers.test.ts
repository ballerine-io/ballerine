import { describe, expect, it } from 'vitest';
import { formatStringValues, getGlobalQueryParams, isBrowser } from './helpers';

describe('helpers', () => {
  describe('isBrowser', () => {
    it('should return true when window is defined', () => {
      // Mock window object
      global.window = {} as Window & typeof globalThis;

      expect(isBrowser()).toBe(true);

      delete global.window;
    });

    it('should return false when window is undefined', () => {
      expect(isBrowser()).toBe(false);
    });
  });

  describe('getGlobalQueryParams', () => {
    it('should return empty object when not in browser', () => {
      const result = getGlobalQueryParams();
      expect(result).toEqual({});
    });

    it('should parse URL search params into object', () => {
      // Mock window with location
      global.window = {
        location: {
          search: '?key1=value1&key2=value2',
        },
      } as Window & typeof globalThis;

      expect(getGlobalQueryParams()).toEqual({
        key1: 'value1',
        key2: 'value2',
      });

      delete global.window;
    });
  });

  describe('formatStringValues', () => {
    it('should return original string if no placeholders found', () => {
      const str = 'Hello World';
      const data = { name: 'John' };

      expect(formatStringValues(str, data)).toBe(str);
    });

    it('should replace single placeholder with value', () => {
      const str = 'Hello {name}';
      const data = { name: 'John' };

      expect(formatStringValues(str, data)).toBe('Hello John');
    });

    it('should replace multiple placeholders with values', () => {
      const str = 'Hello {user.firstName} {user.lastName}';
      const data = {
        user: {
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      expect(formatStringValues(str, data)).toBe('Hello John Doe');
    });

    it('should keep placeholder if value not found in data', () => {
      const str = 'Hello {name} {unknown}';
      const data = { name: 'John' };

      expect(formatStringValues(str, data)).toBe('Hello John {unknown}');
    });
  });
});
