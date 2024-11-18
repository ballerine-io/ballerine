import { describe, expect, it } from 'vitest';
import { getGlobalQueryParams, isBrowser, sanitizeQueryParam } from './helpers';

describe('helpers', () => {
  describe('isBrowser', () => {
    it('should return true when window is defined', () => {
      // Mock window object
      global.window = {} as Window & typeof globalThis;

      expect(isBrowser()).toBe(true);

      delete (global as any).window;
    });

    it('should return false when window is undefined', () => {
      expect(isBrowser()).toBe(false);
    });
  });

  describe('sanitizeQueryParam', () => {
    it('should trim and escape special characters', () => {
      expect(sanitizeQueryParam(' test<script> ')).toBe('test&lt;script&gt;');
      expect(sanitizeQueryParam('  hello&world  ')).toBe('hello&amp;world');
    });
  });

  describe('getGlobalQueryParams', () => {
    it('should return empty object when not in browser', () => {
      const result = getGlobalQueryParams();
      expect(result).toEqual({});
    });

    it('should parse and sanitize URL search params into object', () => {
      // Mock window with location and URLSearchParams
      global.window = {
        location: {
          search: '?key1=<script>&key2= value2 ',
        },
      } as Window & typeof globalThis;

      expect(getGlobalQueryParams()).toEqual({
        key1: '&lt;script&gt;',
        key2: 'value2',
      });

      delete (global as any).window;
    });

    it('should handle multiple sanitized values for same parameter', () => {
      // Mock window with location and URLSearchParams
      global.window = {
        location: {
          search: '?key1=value1<>&key1=value2&key2= value3 ',
        },
      } as Window & typeof globalThis;

      expect(getGlobalQueryParams()).toEqual({
        key1: ['value1&lt;&gt;', 'value2'],
        key2: 'value3',
      });

      delete (global as any).window;
    });
  });
});
