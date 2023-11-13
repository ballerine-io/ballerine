import { useFileUploading } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileUploading/useFileUploading';
import * as storageApi from '@app/domains/storage/storage.api';
import { act, renderHook, waitFor } from '@testing-library/react';
import { HTTPError, NormalizedOptions } from 'ky';

describe('useFileUploading - hook', () => {
  describe('when upload is successful', () => {
    it('will perform transition on isUploading state', async () => {
      jest.spyOn(storageApi, 'uploadFile').mockReturnValue(Promise.resolve({ id: '1212' }));

      const { result } = renderHook(() => useFileUploading());
      expect(result.current.isUploading).toBe(false);

      act(() => {
        void result.current.uploadFile({} as File, 'someFile');
      });

      expect(result.current.isUploading).toBe(true);

      await waitFor(() => {
        expect(result.current.isUploading).toBe(false);
      });
    });

    it('will return id of uploaded file', async () => {
      const testUploadFileId = 'test_file_id';
      jest
        .spyOn(storageApi, 'uploadFile')
        .mockReturnValue(Promise.resolve({ id: testUploadFileId }));

      const { result } = renderHook(() => useFileUploading());

      expect(result.current.isUploading).toBe(false);

      act(() => {
        void result.current.uploadFile({} as File, 'someFile');
      });

      expect(result.current.isUploading).toBe(true);

      await waitFor(() => {
        expect(result.current.isUploading).toBe(false);
        expect(result.current.fileId).toBe(testUploadFileId);
      });
    });
  });

  describe('when upload request failed', () => {
    it('will return HTTPError', async () => {
      const testUploadFileId = 'test_file_id';
      jest
        .spyOn(storageApi, 'uploadFile')
        .mockRejectedValue(new HTTPError({} as Response, {} as Request, {} as NormalizedOptions));

      const { result } = renderHook(() => useFileUploading());

      act(() => {
        void result.current.uploadFile({} as File, testUploadFileId);
      });

      await waitFor(() => {
        expect(result.current.error).toBeInstanceOf(HTTPError);
        expect(result.current.fileId).toBeNull();
        expect(result.current.isUploading).toBe(false);
      });
    });

    it('will persist previous fileId', async () => {
      const testUploadFileId = 'test_file_id';
      jest
        .spyOn(storageApi, 'uploadFile')
        .mockReturnValue(Promise.resolve({ id: testUploadFileId }));

      const { result } = renderHook(() => useFileUploading());

      act(() => {
        void result.current.uploadFile({} as File, testUploadFileId);
      });

      await waitFor(() => {
        expect(result.current.fileId).toBe(testUploadFileId);
      });

      jest
        .spyOn(storageApi, 'uploadFile')
        .mockRejectedValue(new HTTPError({} as Response, {} as Request, {} as NormalizedOptions));

      act(() => {
        void result.current.uploadFile({} as File, testUploadFileId);
      });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
        expect(result.current.fileId).toBe(testUploadFileId);
      });
    });
  });
});
