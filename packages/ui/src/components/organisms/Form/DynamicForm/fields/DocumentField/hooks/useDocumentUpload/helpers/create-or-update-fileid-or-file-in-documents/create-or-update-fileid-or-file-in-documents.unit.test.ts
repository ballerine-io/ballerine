import { describe, expect, it } from 'vitest';
import { IDocumentFieldParams } from '../../../..';
import { IFormElement } from '../../../../../../..';
import { createOrUpdateFileIdOrFileInDocuments } from './create-or-update-fileid-or-file-in-documents';

describe('createOrUpdateFileIdOrFileInDocuments', () => {
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
    },
  };

  it('should create new document when documents array is empty', () => {
    const result = createOrUpdateFileIdOrFileInDocuments([], mockElement, 'test-file-id');

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('test-doc');

    //@ts-ignore
    expect(result[0]?.pages[0].ballerineFileId).toBe('test-file-id');
  });

  it('should create new document when document with template id does not exist', () => {
    const existingDocs = [
      {
        id: 'different-doc',
        type: 'passport',
        pages: [{ ballerineFileId: 'existing-file' }],
      },
    ] as unknown as Array<IDocumentFieldParams['template']>;

    const result = createOrUpdateFileIdOrFileInDocuments(existingDocs, mockElement, 'test-file-id');

    expect(result).toHaveLength(2);
    expect(result[1]?.id).toBe('test-doc');
    //@ts-ignore
    expect(result[1]?.pages[0].ballerineFileId).toBe('test-file-id');
  });

  it('should update existing document when document with template id exists', () => {
    const existingDocs = [
      {
        id: 'test-doc',
        type: 'id_card',
        pages: [{ ballerineFileId: 'old-file-id' }],
      },
    ] as unknown as Array<IDocumentFieldParams['template']>;

    const result = createOrUpdateFileIdOrFileInDocuments(existingDocs, mockElement, 'new-file-id');

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('test-doc');
    //@ts-ignore
    expect(result[0]?.pages[0].ballerineFileId).toBe('new-file-id');
  });

  it('should handle File object as fileIdOrFile parameter', () => {
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

    const result = createOrUpdateFileIdOrFileInDocuments([], mockElement, mockFile);

    expect(result).toHaveLength(1);
    //@ts-ignore
    expect(result[0]?.pages[0].ballerineFileId).toBe(mockFile);
  });

  it('should return original documents when template is missing', () => {
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

    const result = createOrUpdateFileIdOrFileInDocuments(
      existingDocs,
      elementWithoutTemplate,
      'new-file-id',
    );

    expect(result).toBe(existingDocs);
  });

  it('should use default values for pageIndex and pageProperty when not provided', () => {
    const elementWithoutPageParams = {
      ...mockElement,
      params: {
        template: mockTemplate,
      },
    };

    const result = createOrUpdateFileIdOrFileInDocuments(
      [],
      elementWithoutPageParams,
      'test-file-id',
    );

    expect(result).toHaveLength(1);
    //@ts-ignore
    expect(result[0]?.pages[0].ballerineFileId).toBe('test-file-id');
  });
});
