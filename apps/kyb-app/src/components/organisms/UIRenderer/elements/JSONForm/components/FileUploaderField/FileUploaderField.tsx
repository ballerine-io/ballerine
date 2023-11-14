import { useFileAssigner } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileAssigner';
import { useFileRepository } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileRepository';
import { useFileUploading } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileUploading';
import { DocumentUploadFieldProps } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/types';
import { Input } from '@ballerine/ui';
import { forwardRef, useCallback, useEffect, useRef } from 'react';

export const FileUploaderField = forwardRef(
  ({
    onChange,
    onBlur,
    uploadFile: _uploadFile,
    fileRepository: fileStorage,
    fileId,
    isLoading,
    disabled,
    acceptFileFormats,
    placeholder,
  }: DocumentUploadFieldProps) => {
    const { fileId: uploadedFileId, isUploading, uploadFile } = useFileUploading(_uploadFile);
    const { file } = useFileRepository(fileStorage, fileId);
    const inputRef = useRef<HTMLInputElement>(null);
    useFileAssigner(inputRef, file);

    useEffect(() => {
      if (!uploadedFileId) return;

      onChange(uploadedFileId);
    }, [uploadedFileId]);

    const handleChange = useCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        void uploadFile(event.target.files[0]);
      },
      [uploadFile],
    );

    return (
      <Input
        data-testid="file-uploader-field"
        type="file"
        placeholder={placeholder}
        accept={acceptFileFormats}
        disabled={disabled || isLoading || isUploading}
        onChange={handleChange}
        onBlur={onBlur}
        ref={inputRef}
      />
    );
  },
);
