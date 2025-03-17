import { describe, expect, it } from 'vitest';
import { serializeTextFieldValue } from './helpers';

describe('serializeTextFieldValue', () => {
  describe('when valueType is integer', () => {
    it('should convert value to number', () => {
      expect(serializeTextFieldValue('123', 'integer')).toBe(123);
    });

    it('should return undefined for empty value', () => {
      expect(serializeTextFieldValue('', 'integer')).toBeUndefined();
    });
  });

  describe('when valueType is number', () => {
    it('should convert value to number', () => {
      expect(serializeTextFieldValue('123.45', 'number')).toBe(123.45);
    });

    it('should return undefined for empty value', () => {
      expect(serializeTextFieldValue('', 'number')).toBeUndefined();
    });
  });

  describe('when valueType is string', () => {
    it('should return value as is', () => {
      expect(serializeTextFieldValue('test', 'string')).toBe('test');
    });

    it('should return undefined if string is empty', () => {
      expect(serializeTextFieldValue('', 'string')).toBeUndefined();
    });
  });
});
