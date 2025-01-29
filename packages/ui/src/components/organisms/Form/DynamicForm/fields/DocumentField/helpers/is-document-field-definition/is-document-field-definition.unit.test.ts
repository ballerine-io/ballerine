import { describe, expect, it } from 'vitest';
import { IFormElement } from '../../../../types';
import { isDocumentFieldDefinition } from './is-document-field-definition';

describe('isDocumentFieldDefinition', () => {
  it('should return true for document field elements', () => {
    const element: IFormElement<any, any> = {
      id: 'test',
      element: 'documentfield',
      valueDestination: 'test',
      params: {
        label: 'Test Document',
      },
    };

    expect(isDocumentFieldDefinition(element)).toBe(true);
  });

  it('should return false for non-document field elements', () => {
    const element: IFormElement<any, any> = {
      id: 'test',
      element: 'textfield',
      valueDestination: 'test',
      params: {
        label: 'Test Field',
      },
    };

    expect(isDocumentFieldDefinition(element)).toBe(false);
  });

  it('should return false for elements without element property', () => {
    const element = {
      id: 'test',
      valueDestination: 'test',
      params: {},
    } as IFormElement<any, any>;

    expect(isDocumentFieldDefinition(element)).toBe(false);
  });
});
