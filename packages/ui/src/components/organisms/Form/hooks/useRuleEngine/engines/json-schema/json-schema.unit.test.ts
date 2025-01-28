import ajvErrors from 'ajv-errors';
import addFormats from 'ajv-formats';
import Ajv from 'ajv/dist/2019';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TRuleEngine } from '../../types';
import { jsonSchemaEngineRunner } from './json-schema';

vi.mock('ajv/dist/2019');
vi.mock('ajv-formats');
vi.mock('ajv-errors');

describe('jsonSchemaEngineRunner', () => {
  const mockContext = { foo: 'bar' };
  const mockRule = {
    engine: 'json-schema' as TRuleEngine,
    value: { type: 'object' },
  };

  const mockValidate = vi.fn();
  const mockAjv = { validate: mockValidate };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(Ajv).mockImplementation(() => mockAjv as any);
    vi.mocked(addFormats).mockImplementation(() => undefined as any);
    vi.mocked(ajvErrors).mockImplementation(() => undefined as any);
  });

  it('should throw error if rule value is not an object', () => {
    expect(() =>
      jsonSchemaEngineRunner(mockContext, { ...mockRule, value: 'not-an-object' }),
    ).toThrow('JsonSchemaEngineRunner: Rule value must be an object');

    expect(() => jsonSchemaEngineRunner(mockContext, { ...mockRule, value: null })).toThrow(
      'JsonSchemaEngineRunner: Rule value must be an object',
    );
  });

  it('should initialize Ajv with correct default parameters', () => {
    jsonSchemaEngineRunner(mockContext, mockRule);

    expect(Ajv).toHaveBeenCalledWith({
      allErrors: true,
      useDefaults: true,
      validateFormats: false,
    });
  });

  it('should initialize Ajv with custom parameters', () => {
    const customRule = {
      ...mockRule,
      params: {
        allErrors: false,
        useDefaults: false,
      },
    };

    jsonSchemaEngineRunner(mockContext, customRule);

    expect(Ajv).toHaveBeenCalledWith({
      allErrors: false,
      useDefaults: false,
      validateFormats: false,
    });
  });

  it('should add formats with default formats', () => {
    jsonSchemaEngineRunner(mockContext, mockRule);

    expect(addFormats).toHaveBeenCalledWith(mockAjv, {
      formats: ['email', 'uri', 'date', 'date-time'],
      keywords: true,
    });
  });

  it('should add formats with custom formats', () => {
    const customRule = {
      ...mockRule,
      params: {
        formats: ['email'],
        keywords: false,
      },
    };

    jsonSchemaEngineRunner(mockContext, customRule);

    expect(addFormats).toHaveBeenCalledWith(mockAjv, {
      formats: ['email'],
      keywords: false,
    });
  });

  it('should initialize ajv-errors with singleError option', () => {
    jsonSchemaEngineRunner(mockContext, mockRule);

    expect(ajvErrors).toHaveBeenCalledWith(mockAjv, { singleError: true });
  });

  it('should return true when validation passes', () => {
    mockValidate.mockReturnValue(true);
    const result = jsonSchemaEngineRunner(mockContext, mockRule);
    expect(result).toBe(true);
    expect(mockValidate).toHaveBeenCalledWith(mockRule.value, mockContext);
  });

  it('should return false when validation fails', () => {
    mockValidate.mockReturnValue(false);
    const result = jsonSchemaEngineRunner(mockContext, mockRule);
    expect(result).toBe(false);
    expect(mockValidate).toHaveBeenCalledWith(mockRule.value, mockContext);
  });
});
