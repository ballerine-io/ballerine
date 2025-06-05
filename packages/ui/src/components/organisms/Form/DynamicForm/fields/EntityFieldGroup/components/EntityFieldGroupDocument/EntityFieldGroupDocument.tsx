import { ALLOWED_DOCUMENT_FILE_EXTENSIONS, ctw } from '@/common';
import { Button } from '@/components/atoms';
import { Input } from '@/components/atoms/Input';
import { createTestId } from '@/components/organisms/Renderer/utils/create-test-id';
import { Upload, XCircle } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useDynamicForm } from '../../../../context';
import { useElementId, useField } from '../../../../hooks/external';
import { FieldDescription } from '../../../../layouts/FieldDescription';
import { FieldErrors } from '../../../../layouts/FieldErrors';
import { FieldLayout } from '../../../../layouts/FieldLayout';
import { FieldPriorityReason } from '../../../../layouts/FieldPriorityReason';
import { useTaskRunner } from '../../../../providers/TaskRunner/hooks/useTaskRunner';
import { IFormElement, TDynamicFormElement } from '../../../../types';
import { IDocumentFieldParams } from '../../../DocumentField';
import { useDocumentState } from '../../../DocumentField/hooks/useDocumentState/useDocumentState';
import { useStack } from '../../../FieldList';
import { TEntityFieldGroupType } from '../../EntityFieldGroup';
import { useEntityField } from '../../providers/EntityFieldProvider';
import { useCreateDocument } from '../../../DocumentField/hooks/useCreateDocument';
import { useDeleteDocumentFiles } from '../../../DocumentField/hooks/useDeleteDocument';
import { useReuploadDocument } from '../../../DocumentField/hooks/useReuploadDocument';
import { useDocumentFile } from '@/components/organisms/Form/DocumentsService';
import { useDynamicDocumentDefinition } from '../../../DocumentField/hooks/useDynamicDocumentDefinition';

export interface IEntityFieldGroupDocumentParams extends IDocumentFieldParams {
  type: TEntityFieldGroupType;
}

export const EntityFieldGroupDocument: TDynamicFormElement<
  'documentfield',
  IEntityFieldGroupDocumentParams
> = ({ element: _element }) => {
  const { uploadOn = 'change' } = _element.params || {};
  const { values } = useDynamicForm();
  const { stack } = useStack();

  const { isSyncing, entityId, tempEntityId } = useEntityField();
  const { addTask, removeTask } = useTaskRunner();
  const id = useElementId(_element, stack);

  const valuesRef = useRef(values);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  const { documentState, updateState } = useDocumentState(
    _element as IFormElement<'documentfield', IDocumentFieldParams>,
  );

  const { createDocument, isCreatingDocument } = useCreateDocument({
    element: _element,
    entityId: entityId || tempEntityId,
    entityType: 'ubo',
  });

  const { reuploadDocument, isReuploadingDocument } = useReuploadDocument({
    element: _element,
    entityId: entityId || tempEntityId,
    entityType: 'ubo',
  });

  const { deleteDocumentFiles, isDeletingDocumentFiles } = useDeleteDocumentFiles();

  const {
    file,
    isLoading: isLoadingFile,
    isFetching: isFetchingFile,
    document,
    setFile,
    removeFile,
  } = useDocumentFile({
    type: _element.params?.template?.type!,
    category: _element.params?.template?.category!,
    entityType: 'ubo',
    entityId: entityId || tempEntityId,
  });

  const element = useDynamicDocumentDefinition({
    element: _element as IFormElement<'documentfield', IDocumentFieldParams>,
    document: document ?? undefined,
    entityId: entityId ?? undefined,
  });

  const { params } = element;
  const { placeholder = 'Choose file', acceptFileFormats = ALLOWED_DOCUMENT_FILE_EXTENSIONS } =
    params || {};

  const { value, disabled, onChange, onBlur, onFocus } = useField(
    // No need to use modified elelement here unless requested or revisions
    // Otherwise during edit mode element id wont match revision fields and will be disabled
    document?.decision === 'revisions' || document?.status === 'requested' ? element : _element,
    stack,
    documentState,
  );

  useLayoutEffect(() => {
    if (document) {
      updateState(document);
    }
  }, [document, updateState]);

  const inputRef = useRef<HTMLInputElement>(null);
  const focusInputOnContainerClick = useCallback(() => {
    inputRef.current?.click();
  }, [inputRef]);

  const clearFileAndInput = useCallback(async () => {
    if (!element.params?.template?.id) {
      console.warn('Template id is migging in element', element);

      return;
    }

    if (document) {
      await deleteDocumentFiles(document.id);
    }
    onChange(value);

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    removeFile();
  }, [value, element, document, deleteDocumentFiles, onChange, removeFile]);

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      removeTask(id);

      setFile(e.target?.files?.[0] as File);

      if (uploadOn === 'change' && entityId) {
        try {
          if (document) {
            await reuploadDocument(e.target?.files?.[0] as File);
          }

          onChange(value);
        } catch (error) {
          console.error('Failed to upload file.', error);
        }
      }
    },
    [
      uploadOn,
      addTask,
      removeTask,
      onChange,
      id,
      element,
      document,
      reuploadDocument,
      createDocument,
      setFile,
      value,
      entityId,
    ],
  );

  const isShouldDisable = useMemo(() => {
    return (
      disabled ||
      isDeletingDocumentFiles ||
      isSyncing ||
      isReuploadingDocument ||
      isCreatingDocument ||
      isLoadingFile ||
      isFetchingFile
    );
  }, [
    disabled,
    isDeletingDocumentFiles,
    isSyncing,
    isReuploadingDocument,
    isCreatingDocument,
    isLoadingFile,
    isFetchingFile,
  ]);

  return (
    <FieldLayout element={element} elementState={documentState}>
      <div
        className={ctw(
          'relative flex h-[56px] flex-row items-center gap-3 rounded-[16px] border bg-white px-4',
          {
            'pointer-events-none opacity-50': isShouldDisable,
          },
        )}
        onClick={focusInputOnContainerClick}
        data-testid={createTestId(element, stack)}
      >
        <div className="flex gap-3 text-[#007AFF]">
          <Upload />
          <span className="select-none whitespace-nowrap text-base font-bold">{placeholder}</span>
        </div>
        <span className="truncate text-sm">{file ? file.name : 'No File Choosen'}</span>
        {file && (
          <Button
            variant="ghost"
            size="icon"
            className="h-[28px] w-[28px] rounded-full"
            onClick={e => {
              e.stopPropagation();
              void clearFileAndInput();
            }}
          >
            <div className="rounded-full bg-white">
              <XCircle />
            </div>
          </Button>
        )}
        <Input
          data-testid={`${createTestId(element, stack)}-hidden-input`}
          type="file"
          placeholder={placeholder}
          accept={acceptFileFormats}
          disabled={isShouldDisable}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          ref={inputRef}
          className="hidden"
        />
      </div>
      <FieldDescription element={element} />
      <FieldPriorityReason element={element} />
      <FieldErrors element={_element} />
    </FieldLayout>
  );
};
