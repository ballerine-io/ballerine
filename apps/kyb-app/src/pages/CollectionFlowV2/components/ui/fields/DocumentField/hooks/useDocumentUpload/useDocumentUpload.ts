import { UploadFileFn } from '@/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileUploading/types';
import { uploadFile } from '@/domains/storage/storage.api';
import { HTTPError } from 'ky';
import { useCallback, useState } from 'react';

interface IUseDocumentUploadState {
  uploadError: Error | null;
  isUploading: boolean;
}

export const useDocumentUpload = () => {
  const [state, setState] = useState<IUseDocumentUploadState>({
    uploadError: null,
    isUploading: false,
  });

  const fileUploader: UploadFileFn = useCallback(async (file: File) => {
    setState(prevState => ({ ...prevState, isUploading: true }));

    try {
      const { id: fileId } = await uploadFile({ file });

      setState(prevState => ({ ...prevState, uploadError: null }));

      return { fileId };
    } catch (error) {
      if (error instanceof HTTPError) {
        console.error('Error uploading file', error);
        setState(prevState => ({ ...prevState, uploadError: error }));

        throw error;
      }

      setState(prevState => ({ ...prevState, uploadError: new Error('Failed to upload file.') }));

      throw error;
    } finally {
      setState(prevState => ({ ...prevState, isUploading: false }));
    }
  }, []);

  return {
    ...state,
    fileUploader,
  };
};
