import { AnyObject } from '@/common';
import { IHttpParams, useHttp } from '@/common/hooks/useHttp';
import get from 'lodash/get';
import set from 'lodash/set';
import { useCallback, useEffect, useRef } from 'react';
import { useDynamicForm } from '../../../../context';
import { useElementId, useField } from '../../../../hooks/external';
import { useTaskRunner } from '../../../../providers/TaskRunner/hooks/useTaskRunner';
import { ITask } from '../../../../providers/TaskRunner/types';
import { IFormElement } from '../../../../types';
import { useStack } from '../../../FieldList/providers/StackProvider';
import { DEFAULT_CREATION_PARAMS, DEFAULT_UPDATE_PARAMS } from '../../defaults';
import { IDocumentFieldParams } from '../../DocumentField';
import { buildDocumentFormData } from '../../helpers/build-document-form-data';
import {
  checkIfDocumentInRevision,
  checkIfDocumentRequested,
} from './helpers/check-if-document-requested';
import { createOrUpdateDocumentInList } from './helpers/create-or-update-document-in-list';
import { getDocumentObjectFromDocumentsList } from './helpers/get-document-object-from-documents-list';

export const useDocumentUpload = (
  element: IFormElement<'documentfield', IDocumentFieldParams>,
  params: IDocumentFieldParams,
) => {
  const { uploadOn = 'change' } = params;
  const { stack } = useStack();
  const id = useElementId(element, stack);
  const { addTask, removeTask } = useTaskRunner();
  const { metadata, values } = useDynamicForm();
  const { run: uploadDocument, isLoading: isUploading } = useHttp(
    (element.params?.httpParams?.createDocument || DEFAULT_CREATION_PARAMS) as IHttpParams,
    metadata,
  );
  const { run: updateDocument, isLoading: isUpdating } = useHttp(
    (element.params?.httpParams?.updateDocument || DEFAULT_UPDATE_PARAMS) as IHttpParams,
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

      if (uploadOn === 'change') {
        try {
          const documents = get(valuesRef.current, element.valueDestination);
          const document = getDocumentObjectFromDocumentsList(documents, element);

          const isDocumentRequested = checkIfDocumentRequested(document);
          const isDocumentInRevision = checkIfDocumentInRevision(document);
          const isDocumentRequestedOrInRevision = isDocumentRequested || isDocumentInRevision;
          const documentUploadPayload = buildDocumentFormData(
            element,
            { businessId: metadata.businessId as string },
            e.target?.files?.[0] as File,
            document,
          );

          const result = isDocumentRequestedOrInRevision
            ? await updateDocument(documentUploadPayload)
            : await uploadDocument(documentUploadPayload);

          const updatedDocuments = createOrUpdateDocumentInList(documents, element, result);
          onChange(updatedDocuments);
        } catch (error) {
          console.error('Failed to upload file.', error);
        }
      }

      if (uploadOn === 'submit') {
        const documents = get(valuesRef.current, element.valueDestination);
        const updatedDocuments = createOrUpdateDocumentInList(
          documents,
          element,
          e.target?.files?.[0] as File,
        );

        onChange(updatedDocuments);

        const taskRun = async (context: AnyObject) => {
          try {
            const documents = get(context, element.valueDestination);

            const document = getDocumentObjectFromDocumentsList(documents, element);

            const isDocumentRequested = checkIfDocumentRequested(document);
            const isDocumentInRevision = checkIfDocumentInRevision(document);
            const isDocumentRequestedOrInRevision = isDocumentRequested || isDocumentInRevision;
            const documentUploadPayload = buildDocumentFormData(
              element,
              { businessId: metadata.businessId as string },
              e.target?.files?.[0] as File,
              document,
            );

            const result = isDocumentRequestedOrInRevision
              ? await updateDocument(documentUploadPayload)
              : await uploadDocument(documentUploadPayload);

            const updatedDocuments = createOrUpdateDocumentInList(documents, element, result);

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
      metadata,
      addTask,
      removeTask,
      onChange,
      uploadDocument,
      id,
      element,
      valuesRef,
      updateDocument,
    ],
  );

  return {
    isUploading: isUploading || isUpdating,
    handleChange,
  };
};
