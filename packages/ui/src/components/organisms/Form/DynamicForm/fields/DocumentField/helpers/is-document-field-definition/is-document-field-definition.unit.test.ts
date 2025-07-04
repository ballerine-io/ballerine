import { describe, expect, it } from 'vitest';
import { isDocumentFieldDefinition } from './is-document-field-definition';
import { GetUIElementByType } from '@ballerine/common';

describe('isDocumentFieldDefinition', () => {
  it('should return true for document field elements', () => {
    const element = {
      id: 'test',
      element: 'documentfield',
      valueDestination: 'test',
      params: {
        label: 'Test Document',
      },
    } as unknown as GetUIElementByType<'documentfield'>;

    expect(isDocumentFieldDefinition(element)).toBe(true);
  });

  it('should return false for non-document field elements', () => {
    const element = {
      id: 'test',
      element: 'textfield',
      valueDestination: 'test',
      params: {
        label: 'Test Field',
      },
    } as unknown as GetUIElementByType<'documentfield'>;

    expect(isDocumentFieldDefinition(element)).toBe(false);
  });

  it('should return false for elements without element property', () => {
    const element = {
      id: 'test',
      valueDestination: 'test',
      params: {},
    } as unknown as GetUIElementByType<'documentfield'>;

    expect(isDocumentFieldDefinition(element)).toBe(false);
  });
});
