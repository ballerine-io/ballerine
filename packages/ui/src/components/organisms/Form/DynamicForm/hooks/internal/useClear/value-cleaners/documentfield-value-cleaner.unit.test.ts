import { request } from '@/common/hooks/useHttp';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DOCUMENT_FIELD_TYPE, IDocumentFieldParams, IDocumentTemplate } from '../../../../fields';
import { getFileOrFileIdFromDocumentsList } from '../../../../fields/DocumentField/hooks/useDocumentUpload/helpers/get-file-or-fileid-from-documents-list';
import { IFormElement, TBaseFields } from '../../../../types';
import { documentFieldValueCleaner } from './documentfield-value-cleaner';

vi.mock('@/common/hooks/useHttp', () => ({
  request: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock(
  '../../../../fields/DocumentField/hooks/useDocumentUpload/helpers/get-file-or-fileid-from-documents-list',
  () => ({
    getFileOrFileIdFromDocumentsList: vi.fn(),
  }),
);

describe('documentFieldValueCleaner', () => {
  const mockElement: IFormElement<TBaseFields, IDocumentFieldParams> = {
    id: 'documentfield-1',
    valueDestination: 'documentfield-1',
    element: DOCUMENT_FIELD_TYPE,
    params: {
      template: {
        id: 'template-1',
      } as IDocumentTemplate,
      documentType: 'document',
      documentVariant: 'variant',
      httpParams: {
        deleteDocument: {
          url: 'test-url',
        },
      } as IDocumentFieldParams['httpParams'],
    } as IDocumentFieldParams,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return undefined if value is not an array', async () => {
    const result = await documentFieldValueCleaner({} as any, mockElement);
    expect(result).toBeUndefined();
  });

  it('should filter out document with matching template id', async () => {
    const documents = [{ id: 'template-1' }, { id: 'template-2' }, { id: 'template-3' }];
    vi.mocked(getFileOrFileIdFromDocumentsList).mockReturnValue('fileId');
    vi.mocked(request).mockResolvedValue({});

    const result = await documentFieldValueCleaner(documents, mockElement);

    expect(result).toEqual([{ id: 'template-2' }, { id: 'template-3' }]);
    expect(request).toHaveBeenCalledWith(mockElement.params!.httpParams?.deleteDocument, undefined);
  });

  it('should not call delete API if file is instance of File', async () => {
    const documents = [{ id: 'template-1' }, { id: 'template-2' }];
    vi.mocked(getFileOrFileIdFromDocumentsList).mockReturnValue(new File([], 'test.txt'));

    const result = await documentFieldValueCleaner(documents, mockElement);

    expect(request).not.toHaveBeenCalled();
    expect(result).toEqual([{ id: 'template-2' }]);
  });

  it('should handle API error and show toast', async () => {
    const documents = [{ id: 'template-1' }];
    const error = new Error('API Error');
    vi.mocked(getFileOrFileIdFromDocumentsList).mockReturnValue('fileId');
    vi.mocked(request).mockRejectedValue(error);

    const result = await documentFieldValueCleaner(documents, mockElement);

    expect(toast.error).toHaveBeenCalledWith('Failed to delete document on hide. API Error');
    expect(result).toEqual([]);
  });

  it('should not attempt deletion if no deleteDocument params', async () => {
    const elementWithoutDelete = {
      ...mockElement,
      params: {
        ...mockElement.params,
        httpParams: {},
      },
    };
    const documents = [{ id: 'template-1' }];

    const result = await documentFieldValueCleaner(documents, elementWithoutDelete as any);

    expect(request).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should handle empty array', async () => {
    const result = await documentFieldValueCleaner([], mockElement);
    expect(result).toEqual([]);
  });
});
