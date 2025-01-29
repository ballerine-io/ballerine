import { describe, expect, it } from 'vitest';
import { composePathToFileId } from './compose-path-to-file-id';

describe('composePathToFileId', () => {
  it('should compose path with given document index, page property and page index', () => {
    const result = composePathToFileId(0, 'ballerineFileId', 1);
    expect(result).toBe('[0].pages[1].ballerineFileId');
  });

  it('should handle different document indices', () => {
    const result = composePathToFileId(2, 'ballerineFileId', 0);
    expect(result).toBe('[2].pages[0].ballerineFileId');
  });

  it('should handle different page properties', () => {
    const result = composePathToFileId(0, 'customFileId', 0);
    expect(result).toBe('[0].pages[0].customFileId');
  });

  it('should handle different page indices', () => {
    const result = composePathToFileId(0, 'ballerineFileId', 3);
    expect(result).toBe('[0].pages[3].ballerineFileId');
  });

  it('should handle all parameters being zero', () => {
    const result = composePathToFileId(0, 'ballerineFileId', 0);
    expect(result).toBe('[0].pages[0].ballerineFileId');
  });
});
