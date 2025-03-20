import { AnyObject, ctw } from '@/common';
import { IHttpParams, useHttp } from '@/common/hooks/useHttp';
import { Button } from '@/components/atoms';
import { Input } from '@/components/atoms/Input';
import { formatValueDestination } from '@/components/organisms/Form/Validator';
import { createTestId } from '@/components/organisms/Renderer/utils/create-test-id';
import { set } from 'lodash';
import get from 'lodash/get';
import { Upload, XCircle } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useDynamicForm } from '../../../../context';
import { useElementId, useField } from '../../../../hooks/external';
import { useMountEvent } from '../../../../hooks/internal/useMountEvent';
import { useUnmountEvent } from '../../../../hooks/internal/useUnmountEvent';
import { FieldDescription } from '../../../../layouts/FieldDescription';
import { FieldErrors } from '../../../../layouts/FieldErrors';
import { FieldLayout } from '../../../../layouts/FieldLayout';
import { FieldPriorityReason } from '../../../../layouts/FieldPriorityReason';
import { useTaskRunner } from '../../../../providers/TaskRunner/hooks/useTaskRunner';
import { ITask } from '../../../../providers/TaskRunner/types';
import { IFormElement, TDynamicFormElement } from '../../../../types';
import { getDocumentObjectFromDocumentsList, IDocumentFieldParams } from '../../../DocumentField';
import { buildDocumentFormData } from '../../../DocumentField/helpers/build-document-form-data';
import { useDocumentLabelElement } from '../../../DocumentField/hooks/useDocumentLabelElement';
import { useDocumentState } from '../../../DocumentField/hooks/useDocumentState/useDocumentState';
import {
  checkIfDocumentInRevision,
  checkIfDocumentRequested,
} from '../../../DocumentField/hooks/useDocumentUpload/helpers/check-if-document-requested';
import { createOrUpdateDocumentInList } from '../../../DocumentField/hooks/useDocumentUpload/helpers/create-or-update-document-in-list';
import { getFileOrFileIdFromDocumentsList } from '../../../DocumentField/hooks/useDocumentUpload/helpers/get-file-or-fileid-from-documents-list';
import { removeDocumentFromListByTemplateId } from '../../../DocumentField/hooks/useDocumentUpload/helpers/remove-document-from-list-by-template-id';
import { useStack } from '../../../FieldList';
import { TEntityFieldGroupType } from '../../EntityFieldGroup';
import { useEntityField } from '../../providers/EntityFieldProvider';
import {
  DEFAULT_ENTITY_FIELD_GROUP_DOCUMENT_CREATION_PARAMS,
  DEFAULT_ENTITY_FIELD_GROUP_DOCUMENT_REMOVAL_PARAMS,
  DEFAULT_ENTITY_FIELD_GROUP_DOCUMENT_UPDATE_PARAMS,
} from './defaults';

export interface IEntityFieldGroupDocumentParams extends IDocumentFieldParams {
  type: TEntityFieldGroupType;
}

export const EntityFieldGroupDocument: TDynamicFormElement<
  'documentfield',
  IEntityFieldGroupDocumentParams
> = ({ element: _element }) => {
  const { uploadOn = 'change' } = _element.params || {};
  const { metadata, values } = useDynamicForm();
  const { stack } = useStack();
  const element = useMemo(
    () => ({
      ..._element,
      valueDestination: formatValueDestination(_element.valueDestination, stack),
    }),
    [_element, stack],
  );
  const { isSyncing, entityId } = useEntityField();
  const { addTask, removeTask } = useTaskRunner();
  const id = useElementId(element, stack);

  const valuesRef = useRef(values);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  const { documentState, updateState } = useDocumentState(
    element as IFormElement<'documentfield', IDocumentFieldParams>,
  );

  const { run: createDocument, isLoading: isCreatingDocument } = useHttp(
    (element.params?.httpParams?.createDocument as IHttpParams) ||
      DEFAULT_ENTITY_FIELD_GROUP_DOCUMENT_CREATION_PARAMS,
    metadata,
  );

  const { run: updateDocument, isLoading: isUpdatingDocument } = useHttp(
    (element.params?.httpParams?.updateDocument as IHttpParams) ||
      DEFAULT_ENTITY_FIELD_GROUP_DOCUMENT_UPDATE_PARAMS,
    metadata,
  );

  const { run: deleteDocument, isLoading: isDeletingDocument } = useHttp(
    (element.params?.httpParams?.deleteDocument as IHttpParams) ||
      DEFAULT_ENTITY_FIELD_GROUP_DOCUMENT_REMOVAL_PARAMS,
    metadata,
  );

  useMountEvent(element);
  useUnmountEvent(element);

  const { params } = element;
  const { placeholder = 'Choose file', acceptFileFormats = undefined } = params || {};

  const {
    value: documentsList,
    disabled,
    onChange,
    onBlur,
    onFocus,
  } = useField<Array<IDocumentFieldParams['template']> | undefined>(element, stack);
  const value = useMemo(
    () =>
      getFileOrFileIdFromDocumentsList(
        documentsList,
        element as IFormElement<'documentfield', IDocumentFieldParams>,
      ),
    [documentsList, element],
  );

  const document = useMemo(() => {
    return getDocumentObjectFromDocumentsList(
      documentsList,
      element as IFormElement<'documentfield', IDocumentFieldParams>,
    );
  }, [documentsList, element]);

  const file = useMemo(() => {
    if (value instanceof File) {
      return value;
    }

    if (typeof value === 'string') {
      return new File([], value);
    }

    return undefined;
  }, [value]);

  useLayoutEffect(() => {
    updateState(typeof file === 'string' ? file : undefined, document);
  }, [file, document, updateState]);

  const inputRef = useRef<HTMLInputElement>(null);
  const focusInputOnContainerClick = useCallback(() => {
    inputRef.current?.click();
  }, [inputRef]);

  const clearFileAndInput = useCallback(async () => {
    if (!element.params?.template?.id) {
      console.warn('Template id is migging in element', element);

      return;
    }

    const fileIdOrFile = getFileOrFileIdFromDocumentsList(documentsList, element);

    if (typeof fileIdOrFile === 'string') {
      await deleteDocument({
        ids: [fileIdOrFile],
      });
    }

    const updatedDocuments = removeDocumentFromListByTemplateId(
      documentsList,
      element.params?.template?.id as string,
    );

    onChange(updatedDocuments);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [documentsList, element, deleteDocument, onChange]);

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      removeTask(id);

      const documents = get(valuesRef.current, element.valueDestination);
      const document = getDocumentObjectFromDocumentsList(documents, element);

      const isDocumentRequestedOrInRevision =
        checkIfDocumentRequested(document) || checkIfDocumentInRevision(document);

      if (isDocumentRequestedOrInRevision) {
        if (uploadOn === 'change') {
          try {
            const documents = get(valuesRef.current, element.valueDestination);
            const document = getDocumentObjectFromDocumentsList(documents, element);

            const documentUploadPayload = buildDocumentFormData(
              element,
              { entityId: entityId as string },
              e.target?.files?.[0] as File,
              document,
            );

            const result = isDocumentRequestedOrInRevision
              ? await updateDocument(documentUploadPayload)
              : await createDocument(documentUploadPayload);

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

              const documentUploadPayload = buildDocumentFormData(
                element,
                { entityId: entityId as string },
                e.target?.files?.[0] as File,
                document,
              );

              const result = isDocumentRequestedOrInRevision
                ? await updateDocument(documentUploadPayload)
                : await createDocument(documentUploadPayload);

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
      } else {
        const documents = get(valuesRef.current, element.valueDestination);
        const updatedDocuments = createOrUpdateDocumentInList(
          documents,
          element,
          e.target?.files?.[0] as File,
        );
        onChange(updatedDocuments);
      }
    },
    [
      uploadOn,
      addTask,
      removeTask,
      onChange,
      id,
      element,
      valuesRef,
      updateDocument,
      entityId,
      createDocument,
    ],
  );

  return (
    <FieldLayout element={useDocumentLabelElement(element)} elementState={documentState}>
      <div
        className={ctw(
          'relative flex h-[56px] flex-row items-center gap-3 rounded-[16px] border bg-white px-4',
          {
            'pointer-events-none opacity-50':
              disabled ||
              isDeletingDocument ||
              isSyncing ||
              isUpdatingDocument ||
              isCreatingDocument,
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
          disabled={disabled}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          ref={inputRef}
          className="hidden"
        />
      </div>
      <FieldDescription element={element} />
      <FieldPriorityReason element={element} />
      <FieldErrors element={element} />
    </FieldLayout>
  );
};
