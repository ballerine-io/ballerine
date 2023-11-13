import { useFileRepository } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileRepository/useFileRepository';
import { FileRepository } from '@app/utils/file-repository';
import { act, renderHook } from '@testing-library/react';

describe('useFileRepository - hook', () => {
  let repository: FileRepository;

  beforeEach(() => {
    repository = new FileRepository();
  });

  describe('when file is already in repository', () => {
    const testFileId = 'test_file';
    const testFile = { name: 'test_file' } as File;

    beforeEach(() => {
      repository.registerFile(testFileId, testFile);
    });

    it('will return it', () => {
      const { result } = renderHook(() => useFileRepository(repository, testFileId));

      expect(result.current.file).toBe(testFile);
    });
  });

  describe('otherwise', () => {
    it('will be null', () => {
      const { result } = renderHook(() => useFileRepository(repository, 'some-non-existing-id'));

      expect(result.current.file).toBeNull();
    });
  });

  test('file registering', () => {
    const { result } = renderHook(() => useFileRepository(repository));

    const fileId = 'some_file_id';
    const testFile = { name: 'someFile' } as File;

    act(() => {
      result.current.registerFile(testFile, fileId);
    });

    expect(result.current.file).toBe(testFile);
  });

  describe('when using .registerFile', () => {
    it('will return same file instance', () => {
      const { result } = renderHook(() => useFileRepository(repository));

      const fileId = 'some_file_id';
      const testFile = { name: 'someFile' } as File;

      expect(result.current.registerFile(testFile, fileId)).toBe(testFile);
    });
  });
});
