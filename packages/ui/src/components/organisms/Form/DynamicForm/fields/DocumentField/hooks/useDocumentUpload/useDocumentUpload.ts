import { AnyObject } from '@/common';
import get from 'lodash/get';
import set from 'lodash/set';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDynamicForm } from '../../../../context';
import { uploadFile } from '../../../../helpers/upload-file';
import { useElement, useField } from '../../../../hooks/external';
import { useTaskRunner } from '../../../../providers/TaskRunner/hooks/useTaskRunner';
import { ITask } from '../../../../providers/TaskRunner/types';
import { IFormElement } from '../../../../types';
import { formatHeaders } from '../../../../utils/format-headers';
import { formatString } from '../../../../utils/format-string';
import { useStack } from '../../../FieldList/providers/StackProvider';
import { IDocumentFieldParams } from '../../DocumentField';
import { createOrUpdateFileIdOrFileInDocuments } from './helpers/create-or-update-fileid-or-file-in-documents';

export const useDocumentUpload = (
  element: IFormElement<'documentfield', IDocumentFieldParams>,
  params: IDocumentFieldParams<any>,
) => {
  const { uploadOn = 'change' } = params;
  const { stack } = useStack();
  const { id } = useElement(element, stack);
  const { addTask, removeTask } = useTaskRunner();
  const [isUploading, setIsUploading] = useState(false);
  const { metadata, values } = useDynamicForm();

  const { onChange } = useField(element, stack);

  const valuesRef = useRef(values);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      removeTask(id);

      const { uploadSettings } = params;

      if (!uploadSettings) {
        console.warn('Upload settings are missing on element', element, 'Upload will be skipped.');

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
            uploadParams as IDocumentFieldParams['uploadSettings'],
          );

          const documents = get(valuesRef.current, element.valueDestination);
          const updatedDocuments = createOrUpdateFileIdOrFileInDocuments(
            documents,
            element,
            result,
          );
          onChange(updatedDocuments);
        } catch (error) {
          console.error('Failed to upload file.', error);
        } finally {
          setIsUploading(false);
        }
      }

      if (uploadOn === 'submit') {
        const documents = get(valuesRef.current, element.valueDestination);
        const updatedDocuments = createOrUpdateFileIdOrFileInDocuments(
          documents,
          element,
          e.target?.files?.[0] as File,
        );

        onChange(updatedDocuments);

        const taskRun = async (context: AnyObject) => {
          try {
            const documents = get(context, element.valueDestination);

            setIsUploading(true);
            const result = await uploadFile(
              e.target?.files?.[0] as File,
              uploadParams as IDocumentFieldParams['uploadSettings'],
            );

            const updatedDocuments = createOrUpdateFileIdOrFileInDocuments(
              documents,
              element,
              result,
            );

            set(context, element.valueDestination, updatedDocuments);

            return context;
          } catch (error) {
            console.error('Failed to upload file.', error, element);

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
    [uploadOn, params, metadata, addTask, removeTask, onChange, id, element, valuesRef],
  );

  return {
    isUploading,
    handleChange,
  };
};
