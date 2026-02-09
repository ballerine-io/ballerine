import { AnyObject } from '@/common';
import { useCallback } from 'react';
import { useDynamicForm } from '../../../../context';
import { useTaskRunner } from '../../../../providers/TaskRunner/hooks/useTaskRunner';
import { ITask } from '../../../../providers/TaskRunner/types';
import { IFormElement } from '../../../../types';
import { IDocumentFieldParams } from '../../DocumentField';
import { useDocument, useDocumentFile } from '@/components/organisms/Form/DocumentsService';
import { useElementId } from '../../../../hooks/external';
import { useStack } from '../../../FieldList';
import { useCreateDocument } from '../useCreateDocument';
import { useReuploadDocument } from '../useReuploadDocument';
import { useDeleteDocumentFiles } from '../useDeleteDocument';
import { getDocumentEntityTarget } from '../../utils/get-document-entity-target';

export const useDocumentUpload = (
  element: IFormElement<'documentfield', IDocumentFieldParams>,
  params: IDocumentFieldParams,
) => {
  const { metadata } = useDynamicForm();
  const { entityType, entityId } = getDocumentEntityTarget(metadata, 'useDocumentUpload');
  const { uploadOn = 'change' } = params;
  const { addTask, removeTask } = useTaskRunner();
  const { stack } = useStack();
  const id = useElementId(element, stack);
  const document = useDocument({
    type: element.params?.template?.type!,
    category: element.params?.template?.category!,
    entityType,
    entityId,
  });
  const { setFile } = useDocumentFile({
    type: element.params?.template?.type!,
    category: element.params?.template?.category!,
    entityType,
    entityId,
  });
  const { createDocument, isCreatingDocument } = useCreateDocument({
    element,
    entityType,
    entityId,
  });
  const { reuploadDocument, isReuploadingDocument } = useReuploadDocument({
    element,
    entityType,
    entityId,
  });
  const { deleteDocumentFiles, isDeletingDocumentFiles } = useDeleteDocumentFiles();

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      removeTask(id);

      const file = e.target?.files?.[0] as File;

      setFile(file);

      if (document) {
        void deleteDocumentFiles(document.id);
      }

      if (uploadOn === 'change') {
        try {
          document
            ? await reuploadDocument(e.target?.files?.[0] as File)
            : await createDocument(e.target?.files?.[0] as File);
        } catch (error) {
          console.error('Failed to upload file.', error);

          throw error;
        }
      }

      if (uploadOn === 'submit') {
        const taskRun = async (context: AnyObject) => {
          try {
            if (document) {
              await reuploadDocument(e.target?.files?.[0] as File);
            } else {
              await createDocument(e.target?.files?.[0] as File);
            }

            return context;
          } catch (error) {
            console.error('Failed to upload file.', error, element);

            throw error;
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
      id,
      element,
      document,
      createDocument,
      reuploadDocument,
      deleteDocumentFiles,
    ],
  );

  return {
    isUploading: isCreatingDocument || isReuploadingDocument || isDeletingDocumentFiles,
    handleChange,
  };
};
