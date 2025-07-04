import { request } from '@/common/hooks/useHttp';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DOCUMENT_FIELD_TYPE, IDocumentFieldParams, IDocumentTemplate } from '../../../../fields';
import { getDocumentObjectFromDocumentsList } from '../../../../fields';
import { getFileOrFileIdFromDocumentsList } from '../../../../fields/DocumentField/hooks/useDocumentUpload/helpers/get-file-or-fileid-from-documents-list';
import { documentFieldValueCleaner } from './documentfield-value-cleaner';
import { GetUIElementByType } from '@ballerine/common';

vi.mock('@/common/hooks/useHttp', () => ({
  request: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock('../../../../fields', () => ({
  DOCUMENT_FIELD_TYPE: 'documentfield',
  getDocumentObjectFromDocumentsList: vi.fn(),
}));

vi.mock(
  '../../../../fields/DocumentField/hooks/useDocumentUpload/helpers/get-file-or-fileid-from-documents-list',
  () => ({
    getFileOrFileIdFromDocumentsList: vi.fn(),
  }),
);

describe('documentFieldValueCleaner', () => {
  const mockElement = {
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
  } as GetUIElementByType<'documentfield'>;

  const mockMetadata = { userId: '123' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return undefined if value is not an array', async () => {
    const result = await documentFieldValueCleaner({} as any, mockElement);
    expect(result).toBeUndefined();
  });

  it('should filter out document with matching template id', async () => {
    const documents = [{ id: 'template-1' }, { id: 'template-2' }, { id: 'template-3' }];
    const mockDocument = { _document: { id: 'doc-123' } };

    vi.mocked(getDocumentObjectFromDocumentsList).mockReturnValue(mockDocument as any);
    vi.mocked(getFileOrFileIdFromDocumentsList).mockReturnValue('fileId');
    vi.mocked(request).mockResolvedValue({});

    const result = await documentFieldValueCleaner(documents, mockElement, undefined, mockMetadata);

    expect(result).toEqual([{ id: 'template-2' }, { id: 'template-3' }]);
  });

  it('should not call delete API if file is instance of File', async () => {
    const documents = [{ id: 'template-1' }, { id: 'template-2' }];
    vi.mocked(getDocumentObjectFromDocumentsList).mockReturnValue({
      _document: { id: 'doc-123' },
    } as any);
    vi.mocked(getFileOrFileIdFromDocumentsList).mockReturnValue(new File([], 'test.txt'));

    const result = await documentFieldValueCleaner(documents, mockElement);

    expect(request).not.toHaveBeenCalled();
    expect(result).toEqual([{ id: 'template-2' }]);
  });

  it('should handle API error and show toast', async () => {
    const documents = [{ id: 'template-1' }];
    const error = new Error('API Error');
    vi.mocked(getDocumentObjectFromDocumentsList).mockReturnValue({
      _document: { id: 'doc-123' },
    } as any);
    vi.mocked(getFileOrFileIdFromDocumentsList).mockReturnValue('fileId');
    vi.mocked(request).mockRejectedValue(error);

    const result = await documentFieldValueCleaner(documents, mockElement);

    expect(toast.error).toHaveBeenCalledWith('Failed to delete document on hide. API Error');
    expect(result).toEqual([]);
  });

  it('should not attempt deletion if no document id', async () => {
    const documents = [{ id: 'template-1' }];
    vi.mocked(getDocumentObjectFromDocumentsList).mockReturnValue({ _document: {} } as any);
    vi.mocked(getFileOrFileIdFromDocumentsList).mockReturnValue('fileId');

    const result = await documentFieldValueCleaner(documents, mockElement);

    expect(request).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should handle empty array', async () => {
    const result = await documentFieldValueCleaner([], mockElement);
    expect(result).toEqual([]);
  });
});
