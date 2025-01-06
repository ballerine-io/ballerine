import { TDocument } from '@ballerine/common';
import { ICommonValidator, TBaseValidators } from '@ballerine/ui';
import { documentValidator } from './document-validator';
import { IDocumentValidatorParams } from './types';

describe('documentValidator', () => {
  const mockParams: ICommonValidator<IDocumentValidatorParams, TBaseValidators | 'document'> = {
    value: {
      id: 'test-id',
      pageNumber: 0,
      pageProperty: 'ballerineFileId',
    },
    message: 'Custom error message',
    type: 'document',
  };

  it('should return true for valid document', () => {
    const mockDocuments = [
      {
        id: 'test-id',
        0: {
          ballerineFileId: 'file-123',
        },
        propertiesSchema: {},
      },
    ] as TDocument[];

    expect(documentValidator(mockDocuments, mockParams)).toBe(true);
  });

  it('should throw error if value is not an array', () => {
    expect(() => {
      documentValidator(null as any, mockParams);
    }).toThrow('Document is required');
  });

  it('should throw error if value is an empty array', () => {
    expect(() => {
      documentValidator([], mockParams);
    }).toThrow('Document is required');
  });

  it('should throw error if document with specified id is not found', () => {
    const mockDocuments = [
      {
        id: 'wrong-id',
        0: {
          ballerineFileId: 'file-123',
        },
        propertiesSchema: {},
      },
    ] as TDocument[];

    expect(() => {
      documentValidator(mockDocuments, mockParams);
    }).toThrow('Custom error message');
  });

  it('should throw error if document page property is not found', () => {
    const mockDocuments = [
      {
        id: 'test-id',
        0: {},
        propertiesSchema: {},
      },
    ] as TDocument[];

    expect(() => {
      documentValidator(mockDocuments, mockParams);
    }).toThrow('Custom error message');
  });

  it('should use default message if not provided', () => {
    const paramsWithoutMessage: ICommonValidator<
      IDocumentValidatorParams,
      TBaseValidators | 'document'
    > = {
      value: {
        id: 'test-id',
        pageNumber: 0,
        pageProperty: 'ballerineFileId',
      },
      type: 'document',
    };

    const mockDocuments = [
      {
        id: 'wrong-id',
        0: {
          ballerineFileId: 'file-123',
        },
        propertiesSchema: {},
      },
    ] as TDocument[];

    expect(() => {
      documentValidator(mockDocuments, paramsWithoutMessage);
    }).toThrow('Document is required');
  });

  it('should use default pageNumber if not provided', () => {
    const paramsWithoutPageNumber: ICommonValidator<
      IDocumentValidatorParams,
      TBaseValidators | 'document'
    > = {
      value: {
        id: 'test-id',
        pageProperty: 'ballerineFileId',
      },
      message: 'Custom error message',
      type: 'document',
    };

    const mockDocuments = [
      {
        id: 'test-id',
        0: {
          ballerineFileId: 'file-123',
        },
        propertiesSchema: {},
      },
    ] as TDocument[];

    expect(documentValidator(mockDocuments, paramsWithoutPageNumber)).toBe(true);
  });

  it('should use default pageProperty if not provided', () => {
    const paramsWithoutPageProperty: ICommonValidator<
      IDocumentValidatorParams,
      TBaseValidators | 'document'
    > = {
      value: {
        id: 'test-id',
        pageNumber: 0,
      },
      message: 'Custom error message',
      type: 'document',
    };

    const mockDocuments = [
      {
        id: 'test-id',
        0: {
          ballerineFileId: 'file-123',
        },
        propertiesSchema: {},
      },
    ] as TDocument[];

    expect(documentValidator(mockDocuments, paramsWithoutPageProperty)).toBe(true);
  });

  it('should not throw when document value is a File object', () => {
    const params: ICommonValidator<IDocumentValidatorParams, TBaseValidators | 'document'> = {
      value: {
        id: 'test-id',
        pageNumber: 0,
        pageProperty: 'ballerineFileId',
      },
      message: 'Custom error message',
      type: 'document',
    };

    const mockDocuments = [
      {
        id: 'test-id',
        0: {
          ballerineFileId: new File([''], 'test.jpg', { type: 'image/jpeg' }),
        },
        propertiesSchema: {},
      },
    ] as TDocument[];

    expect(documentValidator(mockDocuments, params)).toBe(true);
  });
});
