import { describe, expect, it } from 'vitest';
import { IDocumentTemplate } from '../../../..';
import { removeDocumentFromListByTemplateId } from './remove-document-from-list-by-template-id';

describe('removeDocumentFromListByTemplateId', () => {
  it('should remove document with matching template id from list', () => {
    const documents = [
      {
        id: 'doc1',
        category: 'test',
        type: 'test',
        issuer: {
          country: 'test',
        },
        version: 1,
        issuingVersion: 1,
        properties: {},
      },
      {
        id: 'doc2',
        category: 'test',
        type: 'test',
        issuer: {
          country: 'test',
        },
        version: 1,
        issuingVersion: 1,
        properties: {},
      },
    ] as IDocumentTemplate[];

    const result = removeDocumentFromListByTemplateId(documents, 'doc1');

    expect(result).toHaveLength(1);
    expect(result?.[0]?.id).toBe('doc2');
  });

  it('should return original list if template id not found', () => {
    const documents = [
      {
        id: 'doc1',
        category: 'test',
        type: 'test',
        issuer: {
          country: 'test',
        },
        version: 1,
        issuingVersion: 1,
        properties: {},
      },
      {
        id: 'doc2',
        category: 'test',
        type: 'test',
        issuer: {
          country: 'test',
        },
        version: 1,
        issuingVersion: 1,
        properties: {},
      },
    ] as IDocumentTemplate[];

    const result = removeDocumentFromListByTemplateId(documents, 'doc3');

    expect(result).toHaveLength(2);
    expect(result).toBe(documents);
  });

  it('should handle empty documents array', () => {
    const result = removeDocumentFromListByTemplateId([], 'doc1');

    expect(result).toHaveLength(0);
  });

  it('should handle undefined documents array', () => {
    const result = removeDocumentFromListByTemplateId(undefined, 'doc1');

    expect(result).toHaveLength(0);
  });

  it('should remove only matching document when multiple documents exist', () => {
    const documents = [
      {
        id: 'doc1',
        category: 'test',
        type: 'test',
        issuer: {
          country: 'test',
        },
        version: 1,
        issuingVersion: 1,
        properties: {},
      },
      {
        id: 'doc2',
        category: 'test',
        type: 'test',
        issuer: {
          country: 'test',
        },
        version: 1,
        issuingVersion: 1,
        properties: {},
      },
      {
        id: 'doc3',
        category: 'test',
        type: 'test',
        issuer: {
          country: 'test',
        },
        version: 1,
        issuingVersion: 1,
        properties: {},
      },
    ] as IDocumentTemplate[];

    const result = removeDocumentFromListByTemplateId(documents, 'doc2');

    expect(result).toHaveLength(2);
    expect(result?.[0]?.id).toBe('doc1');
    expect(result?.[1]?.id).toBe('doc3');
  });
});
