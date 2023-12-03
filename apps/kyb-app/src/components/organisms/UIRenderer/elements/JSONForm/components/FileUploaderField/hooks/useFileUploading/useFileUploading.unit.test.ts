import { useFileUploading } from '@/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileUploading/useFileUploading';
import { act, renderHook, waitFor } from '@testing-library/react';
import { HTTPError, NormalizedOptions } from 'ky';

describe('useFileUploading - hook', () => {
  describe('when upload is successful', () => {
    it('will perform transition on isUploading state', async () => {
      const uploader = jest.fn().mockReturnValue(Promise.resolve({ fileId: 'test' }));

      const { result } = renderHook(() => useFileUploading(uploader));
      expect(result.current.isUploading).toBe(false);

      act(() => {
        void result.current.uploadFile({} as File);
      });

      expect(result.current.isUploading).toBe(true);

      await waitFor(() => {
        expect(result.current.isUploading).toBe(false);
      });
    });

    it('will return id of uploaded file', async () => {
      const testUploadFileId = 'test_file_id';
      const uploader = jest.fn().mockReturnValue(Promise.resolve({ fileId: testUploadFileId }));

      const { result } = renderHook(() => useFileUploading(uploader));

      expect(result.current.isUploading).toBe(false);

      act(() => {
        void result.current.uploadFile({} as File);
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
      const uploader = jest
        .fn()
        .mockRejectedValueOnce(
          new HTTPError({} as Response, {} as Request, {} as NormalizedOptions),
        );

      const { result } = renderHook(() => useFileUploading(uploader));

      act(() => {
        void result.current.uploadFile({} as File);
      });

      await waitFor(() => {
        expect(result.current.error).toBeInstanceOf(HTTPError);
        expect(result.current.fileId).toBeNull();
        expect(result.current.isUploading).toBe(false);
      });
    });

    it('will persist previous fileId', async () => {
      const testUploadFileId = 'test_file_id';
      const uploadWithResult = jest
        .fn()
        .mockReturnValue(Promise.resolve({ fileId: testUploadFileId }));

      const { result, rerender } = renderHook(uploaderFn => useFileUploading(uploaderFn), {
        initialProps: uploadWithResult,
      });

      act(() => {
        void result.current.uploadFile({} as File);
      });

      await waitFor(() => {
        expect(result.current.fileId).toBe(testUploadFileId);
      });

      const uploadAndThrow = jest
        .fn()
        .mockRejectedValue(new HTTPError({} as Response, {} as Request, {} as NormalizedOptions));

      rerender(uploadAndThrow);

      act(() => {
        void result.current.uploadFile({} as File);
      });

      await waitFor(() => {
        expect(Boolean(result.current.error)).toBe(true);
        expect(result.current.fileId).toBe(testUploadFileId);
        expect(result.current.isUploading).toBe(false);
      });
    });
  });
});
