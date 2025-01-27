import { TDocument } from '@ballerine/common';
import { ICommonValidator, TBaseValidators } from '@ballerine/ui';
import { describe, expect, it } from 'vitest';
import { documentValidator } from './document-validator';
import { IDocumentValidatorParams } from './types';

describe('documentValidator', () => {
  const mockParams = {
    message: 'Test message',
    value: {
      id: 'test-id',
      pageNumber: 0,
      pageProperty: 'ballerineFileId',
    },
  } as ICommonValidator<IDocumentValidatorParams, TBaseValidators | 'document'>;

  it('should throw error when value is not an array', () => {
    expect(() => documentValidator(null as unknown as TDocument[], mockParams)).toThrow(
      'Test message',
    );
  });

  it('should throw error when array is empty', () => {
    expect(() => documentValidator([], mockParams)).toThrow('Test message');
  });

  it('should throw error when document with specified id is not found', () => {
    const mockDocuments = [{ id: 'wrong-id', pages: [] }] as unknown as TDocument[];

    expect(() => documentValidator(mockDocuments, mockParams)).toThrow('Test message');
  });

  it('should throw error when document page does not exist', () => {
    const mockDocuments = [{ id: 'test-id', pages: [] }] as unknown as TDocument[];

    expect(() => documentValidator(mockDocuments, mockParams)).toThrow('Test message');
  });

  it('should throw error when document page property does not exist', () => {
    const mockDocuments = [
      {
        id: 'test-id',
        pages: [{}],
        propertiesSchema: {},
      },
    ] as TDocument[];

    expect(() => documentValidator(mockDocuments, mockParams)).toThrow('Test message');
  });

  it('should return true for valid document', () => {
    const mockDocuments = [
      {
        id: 'test-id',
        pages: [{ ballerineFileId: 'valid-file-id' }],
        propertiesSchema: {},
      },
    ] as unknown as TDocument[];

    expect(documentValidator(mockDocuments, mockParams)).toBe(true);
  });

  it('should use default values when not provided in params', () => {
    const mockDocuments = [
      {
        id: 'test-id',
        pages: [{ ballerineFileId: 'valid-file-id' }],
        propertiesSchema: {},
      },
    ] as unknown as TDocument[];

    const minimalParams = {
      value: {
        id: 'test-id',
      },
    } as ICommonValidator<IDocumentValidatorParams, TBaseValidators | 'document'>;

    expect(documentValidator(mockDocuments, minimalParams)).toBe(true);
  });
});
