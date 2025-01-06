import { IFormElement } from '@ballerine/ui';
import { buildPathToDocumentFileId, formatFileFieldElement, getDocumentIndex } from './helpers';

describe('buildPathToDocumentFileId', () => {
  it('should build correct path with given params', () => {
    const params = {
      rootPath: 'documents',
      documentIndex: 0,
      page: 1,
      pageProperty: 'fileId',
    };

    const result = buildPathToDocumentFileId(params);

    expect(result).toBe('documents[0].pages[1].fileId');
  });
});

describe('formatFileFieldElement', () => {
  it('should format element with new value destination', () => {
    const element = {
      id: 'test',
      valueDestination: 'old.path',
    } as IFormElement;

    const result = formatFileFieldElement(element, { path: 'new.path' });

    expect(result).toEqual({
      id: 'test',
      valueDestination: 'new.path',
    });
    // Verify original wasn't mutated
    expect(element.valueDestination).toBe('old.path');
  });
});

describe('getDocumentIndex', () => {
  it('should return 0 when documents array is empty', () => {
    const result = getDocumentIndex('documents', { documents: [] }, 'doc1');

    expect(result).toBe(0);
  });

  it('should return index when document id exists', () => {
    const context = {
      documents: [{ id: 'doc1' }, { id: 'doc2' }],
    };

    const result = getDocumentIndex('documents', context, 'doc2');

    expect(result).toBe(1);
  });

  it('should return array length when document id not found', () => {
    const context = {
      documents: [{ id: 'doc1' }, { id: 'doc2' }],
    };

    const result = getDocumentIndex('documents', context, 'doc3');

    expect(result).toBe(2);
  });
});
