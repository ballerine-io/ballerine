import { getFileExtension } from '@/common/get-file-extension/get-file-extension';

describe('getFileExtension', () => {
  describe('when extracting the file extension from a URL', () => {
    it('should handle search query params', () => {
      // Arrange
      let extension: string | undefined;

      // Act
      // eslint-disable-next-line prefer-const
      extension = getFileExtension('http://localhost:3000/test.pdf?test=true');

      // Assert
      expect(extension).toBe('pdf');
    });
  });
});
