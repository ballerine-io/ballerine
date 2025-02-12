import { AnyObject } from '@/common';
import { IHttpParams, useHttp } from '@/common/hooks/useHttp';
import get from 'lodash/get';
import set from 'lodash/set';
import { useCallback, useEffect, useRef } from 'react';
import { useDynamicForm } from '../../../../context';
import { useElement, useField } from '../../../../hooks/external';
import { useTaskRunner } from '../../../../providers/TaskRunner/hooks/useTaskRunner';
import { ITask } from '../../../../providers/TaskRunner/types';
import { IFormElement } from '../../../../types';
import { useStack } from '../../../FieldList/providers/StackProvider';
import { IDocumentFieldParams } from '../../DocumentField';
import { buildDocumentFormData } from '../../helpers/build-document-form-data';
import { createOrUpdateFileIdOrFileInDocuments } from './helpers/create-or-update-fileid-or-file-in-documents';

export const useDocumentUpload = (
  element: IFormElement<'documentfield', IDocumentFieldParams>,
  params: IDocumentFieldParams,
) => {
  const { uploadOn = 'change' } = params;
  const { stack } = useStack();
  const { id } = useElement(element, stack);
  const { addTask, removeTask } = useTaskRunner();
  const { metadata, values } = useDynamicForm();
  const { run: uploadDocument, isLoading: isUploading } = useHttp(
    (element.params?.httpParams?.createDocument || {}) as IHttpParams,
    metadata,
  );

  const { onChange } = useField(element, stack);

  const valuesRef = useRef(values);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      removeTask(id);

      const { createDocument } = params?.httpParams || {};

      if (!createDocument) {
        console.warn('Upload settings are missing on element', element, 'Upload will be skipped.');

        return;
      }

      if (!metadata.entityId) {
        console.warn('Entity ID is missing on element', element, 'Upload will be skipped.');

        return;
      }

      const documentUploadPayload = buildDocumentFormData(
        element,
        { businessId: metadata.businessId as string },
        e.target?.files?.[0] as File,
      );

      if (uploadOn === 'change') {
        try {
          const result = await uploadDocument(documentUploadPayload);

          const documents = get(valuesRef.current, element.valueDestination);
          const updatedDocuments = createOrUpdateFileIdOrFileInDocuments(
            documents,
            element,
            result,
          );
          onChange(updatedDocuments);
        } catch (error) {
          console.error('Failed to upload file.', error);
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

            const result = await uploadDocument(documentUploadPayload);

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
    [
      uploadOn,
      params,
      metadata,
      addTask,
      removeTask,
      onChange,
      uploadDocument,
      id,
      element,
      valuesRef,
    ],
  );

  return {
    isUploading,
    handleChange,
  };
};
