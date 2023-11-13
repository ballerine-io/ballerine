import {
  UploadFileFn,
  UseFileUploadingResult,
} from '@app/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileUploading/types';
import { uploadFile as uploadFileRequest } from '@app/domains/storage/storage.api';
import { HTTPError, NormalizedOptions } from 'ky';
import { useCallback, useState } from 'react';

interface UseFileUploadingState {
  isUploading: boolean;
  error: HTTPError | null;
  fileId: string | null;
}

const initialState: UseFileUploadingState = {
  isUploading: false,
  error: null,
  fileId: null,
};

export const useFileUploading = (): UseFileUploadingResult => {
  const [state, setState] = useState<Partial<UseFileUploadingState>>(initialState);

  const uploadFile: UploadFileFn = useCallback(async (file: File) => {
    try {
      setState(prev => ({ ...prev, isUploading: true }));

      const uploadResult = await uploadFileRequest({ file });

      setState({ isUploading: false, fileId: uploadResult.id, error: null });

      return { fileId: uploadResult.id };
    } catch (error) {
      if (error instanceof HTTPError) {
        console.log(`Failed to upload file. Error ${error.message}`);
        setState(prev => ({ ...prev, isUploading: false, error: error as HTTPError }));
        return;
      }

      setState(prev => ({
        ...prev,
        isUploading: false,
        error: new HTTPError(
          { status: 500, statusText: "Something wen't wrong." } as Response,
          {} as Request,
          {} as NormalizedOptions,
        ),
      }));
    }
  }, []);

  return {
    ...(state as UseFileUploadingState),
    uploadFile,
  };
};
