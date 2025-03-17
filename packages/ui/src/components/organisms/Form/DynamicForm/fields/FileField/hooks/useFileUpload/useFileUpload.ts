import { AnyObject } from '@/common';
import { useHttp } from '@/common/hooks/useHttp';
import set from 'lodash/set';
import { useCallback } from 'react';
import { useDynamicForm } from '../../../../context';
import { useElement, useField } from '../../../../hooks/external';
import { useTaskRunner } from '../../../../providers/TaskRunner/hooks/useTaskRunner';
import { ITask } from '../../../../providers/TaskRunner/types';
import { IFormElement } from '../../../../types';
import { DEFAULT_CREATION_PARAMS } from '../../../DocumentField/defaults';
import { useStack } from '../../../FieldList/providers/StackProvider';
import { IFileFieldParams } from '../../FileField';

export const useFileUpload = (
  element: IFormElement<string, IFileFieldParams>,
  params: IFileFieldParams,
) => {
  const { uploadOn = 'change' } = params;
  const { stack } = useStack();
  const { id } = useElement(element, stack);
  const { addTask, removeTask } = useTaskRunner();
  const { metadata } = useDynamicForm();

  const { run, isLoading } = useHttp(
    element.params?.httpParams?.createDocument || DEFAULT_CREATION_PARAMS,
    metadata,
  );

  const { onChange } = useField(element);

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      removeTask(id);

      const { createDocument } = params?.httpParams || {};

      if (!createDocument) {
        onChange(e.target?.files?.[0] as File);
        console.log('Failed to upload, no upload settings provided');

        return;
      }

      if (uploadOn === 'change') {
        try {
          const formData = new FormData();
          formData.append('file', e.target?.files?.[0] as File);

          const result = await run(formData);
          onChange(result);
        } catch (error) {
          console.error('Failed to upload file.', error);
        }
      }

      if (uploadOn === 'submit') {
        onChange(e.target?.files?.[0] as File);

        const taskRun = async (context: AnyObject) => {
          try {
            const formData = new FormData();
            formData.append('file', e.target?.files?.[0] as File);

            const result = await run(formData);
            set(context, element.valueDestination, result);

            return context;
          } catch (error) {
            console.error('Failed to upload file.', error);

            return context;
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
    [uploadOn, params, addTask, removeTask, onChange, id, element, run],
  );

  return {
    isUploading: isLoading,
    handleChange,
  };
};
