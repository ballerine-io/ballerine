import { useFileAssigner } from '@/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileAssigner';
import { useFileRepository } from '@/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileRepository';
import { useFileUploading } from '@/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileUploading';
import { DocumentUploadFieldProps } from '@/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/types';
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
    const { file, registerFile } = useFileRepository(fileStorage, fileId || undefined);
    const inputRef = useRef<HTMLInputElement>(null);
    //@ts-ignore
    useFileAssigner(inputRef, file);

    useEffect(() => {
      if (!uploadedFileId) return;

      onChange(uploadedFileId);
    }, [uploadedFileId]);

    const handleChange = useCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        registerFile(uploadedFileId, event.target.files?.[0] as File);
        void uploadFile(event.target.files?.[0] as File);
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
