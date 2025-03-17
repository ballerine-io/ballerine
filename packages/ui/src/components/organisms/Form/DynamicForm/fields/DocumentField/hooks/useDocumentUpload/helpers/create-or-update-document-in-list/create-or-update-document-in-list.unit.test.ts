import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IDocumentFieldParams } from '../../../..';
import { IFormElement } from '../../../../../../..';
import { createOrUpdateDocumentInList, TDocument } from './create-or-update-document-in-list';

describe('createOrUpdateDocumentInList', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  const mockTemplate = {
    id: 'test-doc',
    type: 'id_card',
    pages: [{ ballerineFileId: null }],
  } as unknown as IDocumentFieldParams['template'];

  const mockElement: IFormElement<'documentfield', IDocumentFieldParams> = {
    id: 'test-field',
    element: 'documentfield',
    valueDestination: 'documents',
    params: {
      template: mockTemplate,
      pageIndex: 0,
      pageProperty: 'ballerineFileId',
    } as unknown as IDocumentFieldParams,
  };

  const mockDocumentResponse: TDocument = {
    id: 'doc-123',
    documentFile: {
      id: 'docfile-123',
      file: {
        id: 'file-123',
        mimeType: 'image/jpeg',
        fileName: 'test.jpg',
      },
    },
  };

  it('should create new document when documents array is empty', () => {
    // Arrange
    const emptyDocuments: Array<IDocumentFieldParams['template']> = [];

    // Act
    const result = createOrUpdateDocumentInList(emptyDocuments, mockElement, mockDocumentResponse);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('test-doc');
  });

  it('should create new document when document with template id does not exist', () => {
    // Arrange
    const existingDocs = [
      {
        id: 'different-doc',
        type: 'passport',
        pages: [{ ballerineFileId: 'existing-file' }],
      },
    ] as unknown as Array<IDocumentFieldParams['template']>;

    // Act
    const result = createOrUpdateDocumentInList(existingDocs, mockElement, mockDocumentResponse);

    // Assert
    expect(result).toHaveLength(2);
    expect(result[1]?.id).toBe('test-doc');
  });

  it('should update existing document when document with template id exists', () => {
    // Arrange
    const existingDocs = [
      {
        id: 'test-doc',
        type: 'id_card',
        pages: [{ ballerineFileId: 'old-file-id' }],
      },
    ] as unknown as Array<IDocumentFieldParams['template']>;

    // Act
    const result = createOrUpdateDocumentInList(existingDocs, mockElement, mockDocumentResponse);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('test-doc');
    expect(result[0]?._document).toBe(mockDocumentResponse);
  });

  it('should handle File object as document parameter', () => {
    // Arrange
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

    // Act
    const result = createOrUpdateDocumentInList([], mockElement, mockFile);

    // Assert
    expect(result).toHaveLength(1);
  });

  it('should return original documents when template is missing', () => {
    // Arrange
    const elementWithoutTemplate = {
      ...mockElement,
      params: {},
    } as unknown as IFormElement<'documentfield', IDocumentFieldParams>;

    const existingDocs = [
      {
        id: 'test-doc',
        type: 'id_card',
        pages: [{ ballerineFileId: 'existing-file' }],
      },
    ] as unknown as Array<IDocumentFieldParams['template']>;

    // Mock console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Act
    const result = createOrUpdateDocumentInList(
      existingDocs,
      elementWithoutTemplate,
      mockDocumentResponse,
    );

    // Assert
    expect(result).toBe(existingDocs);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Document template is missing on element',
      elementWithoutTemplate,
    );
  });

  it('should use default values for pageIndex and pageProperty when not provided', () => {
    // Arrange
    const elementWithoutPageParams = {
      ...mockElement,
      params: {
        template: mockTemplate,
      },
    } as unknown as IFormElement<'documentfield', IDocumentFieldParams>;

    // Act
    const result = createOrUpdateDocumentInList([], elementWithoutPageParams, mockDocumentResponse);

    // Assert
    expect(result).toHaveLength(1);
    console.log(result[0]);
    expect(result[0]?._document).toBe(mockDocumentResponse);
  });
});
