import { describe, expect, it } from 'vitest';
import { IDocumentTemplate } from '../../../..';
import { checkIfDocumentRequested } from './check-if-document-requested';

describe('checkIfDocumentRequested', () => {
  it('should return true when document is requested and has _id', () => {
    // arrange
    const document: IDocumentTemplate = {
      status: 'requested',
      _id: '123',
    } as IDocumentTemplate;

    // act
    const result = checkIfDocumentRequested(document);

    // assert
    expect(result).toBe(true);
  });

  it('should return false when document is not requested', () => {
    // arrange
    const document: IDocumentTemplate = {
      status: 'provided',
      _id: '123',
    } as IDocumentTemplate;

    // act
    const result = checkIfDocumentRequested(document);

    // assert
    expect(result).toBe(false);
  });

  it('should return false when document has no _id', () => {
    // arrange
    const document: IDocumentTemplate = {
      status: 'requested',
    } as IDocumentTemplate;

    // act
    const result = checkIfDocumentRequested(document);

    // assert
    expect(result).toBe(false);
  });

  it('should return false when document has neither status nor _id', () => {
    // arrange
    const document: IDocumentTemplate = {} as IDocumentTemplate;

    // act
    const result = checkIfDocumentRequested(document);

    // assert
    expect(result).toBe(false);
  });
});
