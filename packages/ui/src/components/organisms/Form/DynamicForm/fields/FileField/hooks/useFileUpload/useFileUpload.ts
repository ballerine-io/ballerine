import { AnyObject } from '@/common';
import set from 'lodash/set';
import { useCallback, useState } from 'react';
import { useDynamicForm } from '../../../../context';
import { useElement, useField } from '../../../../hooks/external';
import { useTaskRunner } from '../../../../providers/TaskRunner/hooks/useTaskRunner';
import { ITask } from '../../../../providers/TaskRunner/types';
import { IFormElement } from '../../../../types';
import { formatString } from '../../../../utils/format-string';
import { useStack } from '../../../FieldList/providers/StackProvider';
import { IFileFieldParams } from '../../FileField';
import { formatHeaders, uploadFile } from './helpers';

export const useFileUpload = (
  element: IFormElement<string, IFileFieldParams>,
  params: IFileFieldParams = {},
) => {
  const { uploadOn = 'change' } = params;
  const { stack } = useStack();
  const { id } = useElement(element, stack);
  const { addTask, removeTask } = useTaskRunner();
  const [isUploading, setIsUploading] = useState(false);
  const { metadata } = useDynamicForm();

  const { onChange } = useField(element);

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      removeTask(id);

      const { uploadSettings } = params;

      if (!uploadSettings) {
        onChange(e.target?.files?.[0] as File);
        console.log('Failed to upload, no upload settings provided');

        return;
      }

      const uploadParams = {
        ...uploadSettings,
        method: uploadSettings?.method || 'POST',
        headers: formatHeaders(uploadSettings?.headers || {}, metadata),
        url: formatString(uploadSettings?.url || '', metadata),
      };

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

      if (uploadOn === 'submit') {
        onChange(e.target?.files?.[0] as File);

        const taskRun = async (context: AnyObject) => {
          try {
            setIsUploading(true);
            const result = await uploadFile(
              e.target?.files?.[0] as File,
              uploadParams as IFileFieldParams['uploadSettings'],
            );
            set(context, element.valueDestination, result);

            return context;
          } catch (error) {
            console.error('Failed to upload file.', error);

            return context;
          } finally {
            setIsUploading(false);
          }
        };

        const task: ITask = {
          id,
          element,
          run: taskRun,
        };
        addTask(task);
      }
    },
    [uploadOn, params, metadata, addTask, removeTask, onChange, id, element],
  );

  return {
    isUploading,
    handleChange,
  };
};
