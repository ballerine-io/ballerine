import { FileRepository } from '@app/utils/file-repository';

describe('FileRepository', () => {
  let repository: FileRepository;

  beforeEach(() => {
    repository = new FileRepository();
  });

  describe('register file and', () => {
    it('retrieve it by id', () => {
      const mockFile = {} as File;
      const mockFileId = 'test-file';

      repository.registerFile(mockFileId, mockFile);

      expect(repository.getFileById(mockFileId)).toBe(mockFile);
    });

    it('retrieve its id by file', () => {
      const mockFile = {} as File;
      const mockFileId = 'test-file';

      repository.registerFile(mockFileId, mockFile);

      expect(repository.getFileId(mockFile));
    });
  });

  describe('retrieving non existing record', () => {
    test('by id', () => {
      expect(repository.getFileById('non existing file')).toBe(null);
    });

    test('by file', () => {
      expect(repository.getFileId({} as File)).toBe(null);
    });
  });

  test('file deletion from repository', () => {
    const mockFile = {} as File;
    const mockFileId = 'test-file';

    repository.registerFile(mockFileId, mockFile);

    expect(repository.getFileById(mockFileId)).toBe(mockFile);

    repository.removeByFileId(mockFileId);

    expect(repository.getFileById(mockFileId)).toBe(null);
  });

  test('registering and retrieval of multiple files', () => {
    const testFileId1 = 'test_file_1';
    const testFileId2 = 'test_file_2';

    const testFile1 = { name: testFileId1 } as File;
    const testFile2 = { name: testFileId2 } as File;

    repository.registerFile(testFileId1, testFile1);
    repository.registerFile(testFileId2, testFile2);

    expect(repository.getFileById(testFileId1)).toBe(testFile1);
    expect(repository.getFileById(testFileId2)).toBe(testFile2);
  });
});
