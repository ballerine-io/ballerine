import { IFormElement } from '@/components/organisms/Form/DynamicForm/types';
import { describe, expect, it } from 'vitest';
import { IDocumentFieldParams } from '../../../../DocumentField';
import { getDocumentObjectFromDocumentsList } from './get-document-object-from-documents-list';

describe('getDocumentObjectFromDocumentsList', () => {
  const mockDocumentsList = [
    {
      id: 'doc1',
      category: 'identification',
      type: 'passport',
      issuer: {
        country: 'US',
      },
      version: 1,
      issuingVersion: 1,
      properties: {},
      pages: [],
    },
    {
      id: 'doc2',
      category: 'proof_of_address',
      type: 'utility_bill',
      issuer: {
        country: 'UK',
      },
      version: 1,
      issuingVersion: 1,
      properties: {},
      pages: [],
    },
  ];

  const mockElement: IFormElement<'documentfield', IDocumentFieldParams> = {
    id: 'test-doc',
    valueDestination: 'test-doc',
    element: 'documentfield',
    params: {
      template: {
        id: 'doc1',
        category: 'identification',
        type: 'passport',
        issuer: {
          country: 'US',
        },
        version: 1,
        issuingVersion: 1,
        properties: {},
        pages: [],
        _document: {
          id: 'doc1',
        },
      },
      documentType: 'passport',
      documentVariant: 'front',
      httpParams: {
        createDocument: {
          url: 'https://example.com/create',
          resultPath: '$.document',
        },
        deleteDocument: {
          url: 'https://example.com/delete',
          resultPath: '$.document',
        },
      },
    },
  };

  it('should return undefined when documentsList is empty', () => {
    // act
    const result = getDocumentObjectFromDocumentsList([], mockElement);

    // assert
    expect(result).toBeUndefined();
  });

  it('should return undefined when document is not found in the list', () => {
    // arrange
    const elementWithNonExistingDoc = {
      ...mockElement,
      params: {
        ...mockElement.params,
        template: {
          ...mockElement.params?.template,
          id: 'non-existing',
        },
        pageIndex: 0,
        pageProperty: 'ballerineFileId',
      },
    } as IFormElement<'documentfield', IDocumentFieldParams>;

    // act
    const result = getDocumentObjectFromDocumentsList(mockDocumentsList, elementWithNonExistingDoc);

    // assert
    expect(result).toBeUndefined();
  });

  it('should return the matching document object when found in the list', () => {
    // act
    const result = getDocumentObjectFromDocumentsList(mockDocumentsList, mockElement);

    // assert
    expect(result).toEqual(mockDocumentsList[0]);
  });

  it('should handle undefined documentsList by returning undefined', () => {
    // act
    const result = getDocumentObjectFromDocumentsList(undefined, mockElement);

    // assert
    expect(result).toBeUndefined();
  });

  it('should handle undefined template in element params by returning undefined', () => {
    // arrange
    const elementWithoutTemplate = {
      ...mockElement,
      params: {
        ...mockElement.params,
        template: undefined,
      },
    } as unknown as IFormElement<'documentfield', IDocumentFieldParams>;

    // act
    const result = getDocumentObjectFromDocumentsList(mockDocumentsList, elementWithoutTemplate);

    // assert
    expect(result).toBeUndefined();
  });
});
