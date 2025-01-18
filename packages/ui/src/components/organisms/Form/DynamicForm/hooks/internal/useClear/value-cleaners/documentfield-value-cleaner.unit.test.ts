import { describe, expect, it } from 'vitest';
import { DOCUMENT_FIELD_TYPE, IDocumentFieldParams } from '../../../../fields';
import { TBaseFields } from '../../../../repositories';
import { IFormElement } from '../../../../types';
import { documentFieldValueCleaner } from './documentfield-value-cleaner';

describe('documentFieldValueCleaner', () => {
  const mockElement: IFormElement<TBaseFields, IDocumentFieldParams> = {
    id: 'documentfield-1',
    valueDestination: 'documentfield-1',
    element: DOCUMENT_FIELD_TYPE,
    params: {
      template: {
        id: 'template-1',
        pages: [],
      },
    },
  };

  it('should return undefined if value is not an array', () => {
    const result = documentFieldValueCleaner({} as any, mockElement);
    expect(result).toBeUndefined();
  });

  it('should filter out document with matching template id', () => {
    const documents = [{ id: 'template-1' }, { id: 'template-2' }, { id: 'template-3' }];

    const result = documentFieldValueCleaner(documents, mockElement);

    expect(result).toEqual([{ id: 'template-2' }, { id: 'template-3' }]);
  });

  it('should return same array if no matching template id found', () => {
    const documents = [{ id: 'template-2' }, { id: 'template-3' }];

    const result = documentFieldValueCleaner(documents, mockElement);

    expect(result).toEqual(documents);
  });

  it('should handle empty array', () => {
    const result = documentFieldValueCleaner([], mockElement);
    expect(result).toEqual([]);
  });

  it('should handle undefined template id in element params', () => {
    const elementWithoutTemplate = {
      element: DOCUMENT_FIELD_TYPE,
      params: {},
    };

    const documents = [{ id: 'template-1' }, { id: 'template-2' }];

    const result = documentFieldValueCleaner(documents, elementWithoutTemplate as any);
    expect(result).toEqual(documents);
  });
});
