import { useCallback, useState } from 'react';
import { useDynamicForm } from '../../../../context';
import { useField } from '../../../../hooks/external';
import { IFormElement } from '../../../../types';
import { IFileFieldParams } from '../../FileField';
import { formatHeaders, uploadFile } from './helpers';

export const useFileUpload = (
  element: IFormElement<string, IFileFieldParams>,
  params: IFileFieldParams = {},
) => {
  const { uploadOn = 'change' } = params;
  const [isUploading, setIsUploading] = useState(false);
  const { metadata } = useDynamicForm();

  const { onChange } = useField(element);

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { uploadSettings } = params;

      const uploadParams = {
        ...uploadSettings,
        method: uploadSettings?.method || 'POST',
        headers: formatHeaders(uploadSettings?.headers || {}, metadata),
      };

      console.log('uploadParams', uploadParams);

      if (uploadOn === 'change') {
        try {
          setIsUploading(true);

          const result = await uploadFile(
            e.target?.files?.[0] as File,
            uploadParams as IFileFieldParams['uploadSettings'],
          );
          onChange(result);
        } catch (error) {
          console.error('Failed to upload file.', error);
        } finally {
          setIsUploading(false);
        }
      }
    },
    [uploadOn, params, metadata, onChange],
  );

  return {
    isUploading,
    handleChange,
  };
};
