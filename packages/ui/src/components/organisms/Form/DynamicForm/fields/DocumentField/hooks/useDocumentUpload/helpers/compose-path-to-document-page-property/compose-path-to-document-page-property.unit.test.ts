import { describe, expect, it } from 'vitest';
import { composePathToDocumentPageProperty } from './compose-path-to-document-page-property';

describe('composePathToDocumentPageProperty', () => {
  it('should compose path with given document index, page property and page index', () => {
    const result = composePathToDocumentPageProperty(0, 'ballerineFileId', 1);
    expect(result).toBe('[0].pages[1].ballerineFileId');
  });

  it('should handle different document indices', () => {
    const result = composePathToDocumentPageProperty(2, 'ballerineFileId', 0);
    expect(result).toBe('[2].pages[0].ballerineFileId');
  });

  it('should handle different page properties', () => {
    const result = composePathToDocumentPageProperty(0, 'customFileId', 0);
    expect(result).toBe('[0].pages[0].customFileId');
  });

  it('should handle different page indices', () => {
    const result = composePathToDocumentPageProperty(0, 'ballerineFileId', 3);
    expect(result).toBe('[0].pages[3].ballerineFileId');
  });

  it('should handle all parameters being zero', () => {
    const result = composePathToDocumentPageProperty(0, 'ballerineFileId', 0);
    expect(result).toBe('[0].pages[0].ballerineFileId');
  });
});
