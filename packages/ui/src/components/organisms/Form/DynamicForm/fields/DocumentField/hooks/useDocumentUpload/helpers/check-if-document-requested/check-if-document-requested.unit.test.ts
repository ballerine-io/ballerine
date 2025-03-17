import { describe, expect, it } from 'vitest';
import { IDocumentTemplate } from '../../../..';
import { checkIfDocumentRequested } from './check-if-document-requested';

describe('checkIfDocumentRequested', () => {
  it('should return true when document is requested and has id', () => {
    // arrange
    const document: IDocumentTemplate = {
      _document: {
        id: '123',
        status: 'requested',
      },
    } as unknown as IDocumentTemplate;

    // act
    const result = checkIfDocumentRequested(document);

    // assert
    expect(result).toBe(true);
  });

  it('should return false when document is not requested', () => {
    // arrange
    const document: IDocumentTemplate = {
      status: 'provided',
      _document: {
        id: '123',
      },
    } as unknown as IDocumentTemplate;

    // act
    const result = checkIfDocumentRequested(document);

    // assert
    expect(result).toBe(false);
  });

  it('should return false when document has no id', () => {
    // arrange
    const document: IDocumentTemplate = {
      _document: {
        status: 'requested',
      },
    } as unknown as IDocumentTemplate;

    // act
    const result = checkIfDocumentRequested(document);

    // assert
    expect(result).toBe(false);
  });

  it('should return false when document has neither status nor id', () => {
    // arrange
    const document: IDocumentTemplate = {} as unknown as IDocumentTemplate<any>;

    // act
    const result = checkIfDocumentRequested(document);

    // assert
    expect(result).toBe(false);
  });
});
