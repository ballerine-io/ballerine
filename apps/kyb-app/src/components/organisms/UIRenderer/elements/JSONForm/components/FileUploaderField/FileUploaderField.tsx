import { useFileAssigner } from '@/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileAssigner';
import { useFileRepository } from '@/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileRepository';
import { useFileUploading } from '@/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileUploading';
import { DocumentUploadFieldProps } from '@/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/types';
import { Input } from '@ballerine/ui';
import { Upload } from 'lucide-react';
import { useCallback, useRef } from 'react';

export const FileUploaderField = ({
  onChange,
  onBlur,
  uploadFile: _uploadFile,
  fileRepository: fileStorage,
  fileId,
  isLoading,
  disabled,
  acceptFileFormats,
  placeholder,
  testId,
}: DocumentUploadFieldProps) => {
  const { isUploading, uploadFile } = useFileUploading(_uploadFile);
  const { file: registeredFile, registerFile } = useFileRepository(
    fileStorage,
    fileId || undefined,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  //@ts-ignore
  useFileAssigner(inputRef, registeredFile);

  const handleChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) return;

      const uploadResult = await uploadFile(file);

      registerFile(file, uploadResult.fileId);

      onChange(uploadResult.fileId);
    },
    [uploadFile, registerFile, onChange],
  );

  const handdleContainerClick = useCallback(() => {
    inputRef.current?.click();
  }, [inputRef]);

  return (
    <div
      className="flex h-[56px] flex-row items-center gap-3 rounded-[16px] border bg-white px-4"
      onClick={handdleContainerClick}
    >
      <div className="flex gap-3 text-[#007AFF]">
        <Upload />
        <span className="select-none whitespace-nowrap text-base font-bold">Choose file</span>
      </div>
      <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm">
        {registeredFile ? registeredFile.name : 'No File Choosen'}
      </span>
      <Input
        data-testid={testId}
        type="file"
        placeholder={placeholder}
        accept={acceptFileFormats}
        disabled={disabled || isLoading || isUploading}
        onChange={handleChange}
        onBlur={onBlur}
        ref={inputRef}
        className="hidden"
      />
    </div>
  );
};
