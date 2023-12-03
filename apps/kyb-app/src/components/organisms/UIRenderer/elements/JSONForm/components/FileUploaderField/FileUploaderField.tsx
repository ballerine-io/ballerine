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
      if (!uploadedFileId || !file) return;

      registerFile(file, uploadedFileId);
      onChange(uploadedFileId);
    }, [uploadedFileId, file]);

    const handleChange = useCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const uploadResult = await uploadFile(file);
        registerFile(file, uploadResult.fileId);
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
