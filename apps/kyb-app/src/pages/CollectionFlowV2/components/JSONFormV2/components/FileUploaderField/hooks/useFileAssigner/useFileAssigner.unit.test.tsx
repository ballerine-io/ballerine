import { useFileAssigner } from '@/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileAssigner/useFileAssigner';
import { renderHook, waitFor } from '@testing-library/react';

//@ts-ignore
window.DataTransfer = function () {};

//@ts-ignore
jest.spyOn(window, 'DataTransfer', 'get').mockImplementation(function () {
  return function () {
    // Mocking FileList
    const files: any = {
      length: 0,
      item: function (index: number) {
        //@ts-ignore
        return this[index] as File;
      },
    };

    return {
      files,
      items: {
        add: function (file: File) {
          //@ts-ignore
          files[files.length] = file;
          files.length = files.length + 1;
        },
      },
    };
  };
});

describe('useFileAssigner - hook', () => {
  describe('when file is present', () => {
    it('will override files on HTMLInput ref', async () => {
      const inputRef = {
        current: {
          files: [] as File[],
        } as unknown as HTMLInputElement,
      } as React.MutableRefObject<HTMLInputElement>;

      const testFile = new File([], 'test-file');
      renderHook(() => useFileAssigner(inputRef, testFile));

      await waitFor(() => {
        expect(inputRef.current.files?.length).toBe(1);
      });
    });
  });

  describe('without file', () => {
    it('will not mutate HTMLInput files list', async () => {
      const filesList: File[] = [];

      const inputRef = {
        current: {
          files: filesList,
        } as unknown as HTMLInputElement,
      } as React.MutableRefObject<HTMLInputElement>;

      renderHook(() => useFileAssigner(inputRef, null));

      await waitFor(() => {
        expect(inputRef.current.files).toBe(filesList);
      });
    });
  });
});
