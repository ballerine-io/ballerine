import { AnyObject } from '@/common';
import { useCallback } from 'react';
import { useDynamicForm } from '../../../../context';
import { useTaskRunner } from '../../../../providers/TaskRunner/hooks/useTaskRunner';
import { ITask } from '../../../../providers/TaskRunner/types';
import { IFormElement } from '../../../../types';
import { IDocumentFieldParams } from '../../DocumentField';
import { useDocument, useDocumentFile } from '@/components/organisms/Form/DocumentsService';
import { useElementId, useField } from '../../../../hooks/external';
import { useStack } from '../../../FieldList';
import { useCreateDocument } from '../useCreateDocument';
import { useReuploadDocument } from '../useReuploadDocument';

export const useDocumentUpload = (
  element: IFormElement<'documentfield', IDocumentFieldParams>,
  params: IDocumentFieldParams,
) => {
  const { metadata } = useDynamicForm();
  const { uploadOn = 'change' } = params;
  const { addTask, removeTask } = useTaskRunner();
  const { stack } = useStack();
  const id = useElementId(element, stack);
  const { onChange } = useField(element, stack);
  const document = useDocument({
    type: element.params?.template?.type!,
    category: element.params?.template?.category!,
    entityType: 'business',
    entityId: metadata.businessId!,
  });
  const { file, setFile } = useDocumentFile({
    type: element.params?.template?.type!,
    category: element.params?.template?.category!,
    entityType: 'business',
    entityId: metadata.businessId!,
  });
  const { createDocument, isCreatingDocument } = useCreateDocument({
    element,
    entityType: 'business',
    entityId: metadata.businessId!,
  });
  const { reuploadDocument, isReuploadingDocument } = useReuploadDocument({
    element,
    entityType: 'business',
    entityId: metadata.businessId!,
  });

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      removeTask(id);

      const file = e.target?.files?.[0] as File;

      setFile(file);

      if (uploadOn === 'change') {
        try {
          document
            ? await reuploadDocument(e.target?.files?.[0] as File)
            : await createDocument(e.target?.files?.[0] as File);

          onChange([]);
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
    [uploadOn, metadata, addTask, removeTask, onChange, id, element, document],
  );

  return {
    isUploading: isCreatingDocument || isReuploadingDocument,
    handleChange,
  };
};
