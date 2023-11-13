import { useFileAssigner } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileAssigner';
import { useFileRepository } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileRepository';
import { DocumentUploadFieldProps } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/types';
import { Input } from '@ballerine/ui';
import { useRef } from 'react';

export const FileUploaderField = ({
  onChange,
  uploadFile,
  fileStorage,
  fileId,
  isLoading,
  disabled,
  acceptFileFormats,
  placeholder,
}: DocumentUploadFieldProps) => {
  const { file } = useFileRepository(fileStorage, fileId);
  const inputRef = useRef<HTMLInputElement>(null);
  useFileAssigner(inputRef, file);

  return (
    <Input
      type="file"
      placeholder={placeholder}
      accept={acceptFileFormats}
      disabled={disabled || isLoading}
      ref={inputRef}
    />
  );
};
